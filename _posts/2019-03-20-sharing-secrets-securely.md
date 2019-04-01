---
layout: post
title:  "Sharing Secrets Securely"
description: "Brief overview of how to securely send secret files"
tags: [UNIX, Encryption, Credentials]

---

As a developer|sysadmin|devops or almost any other kind of IT person you are
going to need to share some secret information with your colleagues at some
point. Think passwords, DB credentials, AWS credentials... extremely sensitive
stuff.

Below are a couple of my favourite ways to do it, ordered from least secure and
easiest to use to most secure and "hardest" to wrap your head around and use.
They are all UNIX/terminal based since I have literally never seen GUI in my
life :)

First off, let's create a playground directory and a fake secret file:

```bash
$ cd ~
$ mkdir secret_sharing/
$ cd secret_sharing/
$ cat << _EOF_ >> ./secret.txt
USER: dusan
PASS: password123
_EOF_
$ ls
secret.txt
```

## Content:
1. [Zip](#1-zip)
2. [ccrypt](#2-ccrypt)
3. [OpenSSL/LibreSSL](#3-openssllibressl)
4. [GnuPG](#4-gnupg)
    - [Troubleshooting: GnuPG Non-ASCII User Identifier](#troubleshooting-gnupg-non-ascii-user-identifier)
    - [Bonus 1: GnuPG key management](#bonus-1-gnupg-key-management)
    - [Bonus 2: GnuPG signing](#bonus-2-gnupg-signing)
    - [Bonus 3: GnuPG public key verification & _web of trust_](#bonus-3-gnupg-public-key-verification--web-of-trust)

# 1. zip

`zip` is a utility that comes with most popular unix derivatives, so there
is most likely no need to even install anything. you can check if you have
it by running:

```bash
zip --version
```

in order to transfer the secret file securely to another person we can `zip`
compress it and encrypt the compressed file with a simple password:

```bash
$ zip -e secret.zip secret.txt
enter password:
verify password:
  adding: secret.txt (stored 0%)
$ ls
secret.txt secret.zip
```

remove the original secret file, since we are going to derive it from the
zip package:
```bash
$ rm secret.txt
```

now let's reverse the process and unzip/decrypt:
```bash
$ unzip secret.zip
archive:  secret.zip
[secret.zip] secret.txt password:
 extracting: secret.txt
$ ls
secret.txt secret.zip
```

and remove the zip file in order to clean up:
```bash
$ rm secret.zip
```

that's as simple as it gets.

## ux and security

`zip` is extremely easy to use and in most cases requires no installation or
setup.

there are a couple of problems with this method though. it only works well if
the person that you want to share the secret file with is physically near you
so you can verbally share the decryption password with them.

you can also use this method to share secret files with people that are not in
your physical vicinity - by sending them the password over some different
channel than the one that you used to send the encrypted file to them.

let's say that you have sent the compressed/encrypted file to the recipient in
an email attachment. there are a couple of ways to pretty securely send the
decryption password, here are 2 ideas:

1. call them using some e2e encrypted voip application and tell them the password
2. send the password using some e2e encrypted chat application, preferrably with message auto-expiry

one of the big security risks with symmetric, password based secret sharing are
keyloggers and audio surveillance (smartphones, laptop or hidden mics), so you
should keep in mind that this is not the best way to share information that is
a matter of life or death.

## verdict:
```
security : 5
ux       : 10
```

# 2. ccrypt

`ccrypt` is a nice and easy tool designed for secret sharing.

go to http://ccrypt.sourceforge.net/ and install `ccrypt` on your machine if
you don't have it already.

to encrypt, use `ccencrypt` and enter an encryption password which will be
used for decryption later:
```bash
$ ccencrypt ./secret.txt
enter encryption key:
enter encryption key: (repeat)
$ ls
secret.txt.cpt
```

once you encrypt the file, the original is rewritten by the newly created
encrypted file - `secret.txt.cpt`.

in order to decrypt - use `ccdecrypt` which will prompt you for the password
that you entered during encryption.

```bash
$ ccdecrypt secret.txt.cpt
enter decryption key:
$ ls
secret.txt
```

## ux and security

`ccrypt` is extremely simple and easy to set up and use.

it is more secure than `zip` compression because of the fact that it overrides
the original file on disk, leaving no way to recover it afterwards.

aside from that - it shares the same security challenges as the previous method
since we're again dealing with passwords.

## verdict:
```
security : 6.5
ux       : 10
```

# 3. openssl/libressl

**openssl** has recieved some pretty negative publicity in the past because of
its shortcomings (see - [heartbleed](http://heartbleed.com/)). the programmers
who worked on it dispersed which made the **openssl** development stop. that's
why we will use **libressl** instead.

as [the libressl website](https://www.libressl.org/) states:

> libressl is a version of the tls/crypto stack forked from openssl in 2014, with
goals of modernizing the codebase, improving security, and applying best
practice development processes.

## installation

**openssl** comes with most unix-like derivatives, and some of them have upgraded
to **libressl**.

the [libressl github readme](https://github.com/libressl-portable/portable#compatibility-with-openssl) says:

> libressl is api compatible with openssl 1.0.1, but does not yet include all
new apis from openssl 1.0.2 and later. libressl also includes apis not yet
present in openssl. the current common api subset is openssl 1.0.1.

what this means, for the purpose of this article, is that you can use either
**openssl** or **libressl**. commands i use below are the same for both.

if neither one of those are present on your system, the installation is pretty
straight-forward for both, so pick one (**libressl** if you can't decide) and
let's get on with it.

## symmetric key use case

let's start with the simplest possible example, using the aes-256 cypher.

```
$ openssl enc -aes-256-ctr -in secret.txt -out secret.txt.enc
enter aes-256-ctr encryption password:
verifying - enter aes-256-ctr encryption password:
```

we now have an encrypted file that we can send to the recepient.
```
$ ls
secret.txt     secret.txt.enc
```

notice that the original file is still there. let's ([naively](https://ssd.eff.org/en/module/how-delete-your-data-securely-linux))
delete it:
```
$ rm secret.txt
```

use the `-d` flag to decrypt and enter the decryption password:
```
$ openssl enc -aes-256-ctr -d -in secret.txt.enc -out secret.txt
enter aes-256-ctr decryption password:
$ cat secret.txt
user: dusan
pass: password123
```

this is as simple as it gets and it's not much more secure than using `zip`.

## asymmetric key use case

### generating an asymmetric key pair

**up until now we have been dealing with `symmetric` encryption - meaning that
both parties share the same key, which is used both for encryption and
decryption.**

**from this point forward, we are going to explore `asymmetric` encryption,
meaning that there are 2 keys involved - one for encryption (public key) and
the other one for decryption (private key).**

> the reverse is also common - using the private key to encrypt and the public
key to decrypt, but that's not relevant for our particular use case here.

let's start by generating the **private/public** key pair.

i'll generate an **rsa 4096 bit** private key first:
```
$ openssl genrsa -out privkey.pem 4096
```

**notice:** the private key should be kept in a very safe place! never share it
with anyone. it should absolutely always stay only on your machine. i will go
one step forward and encrypt the private key itself with a password:
```
$ openssl rsa -in privkey.pem -aes-256-ctr -out privkey.pem.enc
```

delete the unencrypted private key ([naively](https://ssd.eff.org/en/module/how-delete-your-data-securely-linux)):
```
$ rm privkey.pem
```

now, for the second part, i derive the **public key** from the previously created
and encrypted **private key**:
```
$ openssl rsa -in privkey.pem.enc -pubout -out pubkey.pem
```

### encryption/decryption

if you want someone to send you an encrypted file, you need to give them your
public key. use a "secure" channel transfer it to them.

now, the other person (who also has **libressl** or **openssl** installed) can use
your public key to encrypt a file and send it to you:
```
$ openssl rsautl -encrypt -in secret.txt -pubin -inkey pubkey.pem -out secret.txt.enc
```

> if you're encrypting and decrypting on the same machine for testing purposes
make sure that you ([naively](https://ssd.eff.org/en/module/how-delete-your-data-securely-linux)) delete the original file: `rm secret.txt`

after you receive the encrypted file, use your encrypted private key to decrypt
it:
```
$ openssl rsautl -decrypt -in secret.txt.enc -out secret.txt -inkey privkey.pem.enc
enter pass phrase for privkey.pem.enc:
```

enter the password for decrypting your private key and you're done!

```
$ cat secret.txt
user: dusan
pass: password123
```

## verdict:

**symmetric key use case:**:
```
security : 5.5
ux       : 8
```

**aymmetric key use case:**:
```
security : 9
ux       : 7
```

# 4. gnupg

as the `gpg` man page says:
> `gnupg` is a tool to provide digital encryption and signing services using the
openpgp standard. `gnupg` features complete key management and all the bells and
whistles you would expect from a full openpgp implementation.

in short, `gnupg` is a tool for secure communication, be it email encryption or
secure file sharing as in the case of this article.

## symmetric key use case

you can use `gnupg` for **symmetric key** encryption, but i'm not going
to cover it in detail. here is just a short example:

```bash
# run the encryption command and enter the symmetric key passphrase twice:
$ gpg -c secret.txt
$ rm secret.txt
$ ls
secret.txt.gpg

# send the encrypted file to the other computer and decrypt it using the same
# passphrase:
$ gpg -d -o secret.txt secret.txt.gpg
gpg: aes encrypted data
gpg: encrypted with 1 passphrase
$ cat secret.txt
user: dusan
pass: password123
```

now let's get to the more secure, **assymetric key** use case...

## assymetric key use case

### generating a gnupg private/public key pair

i advise that you use the `gpg --full-gen-key` command for key generation,
since it's going to offer you the most control. running this command will
prompt you for a couple of input parameters, first of them being the encryption
algorithm. i will choose `rsa and rsa`:

```
$ gpg --full-gen-key
gpg (gnupg) 2.2.7; copyright (c) 2018 free software foundation, inc.
this is free software: you are free to change and redistribute it.
there is no warranty, to the extent permitted by law.

please select what kind of key you want:
 (1) rsa and rsa (default)
 (2) dsa and elgamal
 (3) dsa (sign only)
 (4) rsa (sign only)
your selection? 1
```

next you need to choose the keysize, i will pick `4096 bits` which will make
it opaque to brute-force attacks:
```
rsa keys may be between 1024 and 4096 bits long.
what keysize do you want? (2048) 4096
requested keysize is 4096 bits
```

for key validity, i suggest using a definite expiry period. for the sake of an
example i'll choose `3 months`:
```
please specify how long the key should be valid.
       0 = key does not expire
    <n>  = key expires in n days
    <n>w = key expires in n weeks
    <n>m = key expires in n months
    <n>y = key expires in n years
key is valid for? (0) 3m
key expires at mon jun 18 22:07:00 2019 cest
is this correct? (y/n) y
```

next up, gnupg is going to ask for some personal info in order to create a user
id to go along with the newly created key pair:

1. **real name:** you can put in whatever you want, but [be sure to use only ascii
characters](#gnupg-non-ascii-user-identifier-troubleshooting) because otherwise you might introduce bugs.
2. **email address:** self explanatory.
3. **comment:** whatever you want, i just leave this blank.

```
gnupg needs to construct a user id to identify your key.

real name: dusan dimitric
email address: dusan_dimitric@yahoo.com
comment:
you selected this user-id:
  "dusan dimitric <dusan_dimitric@yahoo.com>"

change (n)ame, (c)omment, (e)mail or (o)kay/(q)uit? o
```

next you're going to be presented with 2 dialogs where you will choose and
confirm a passphrase that will protect your private key:
```
┌──────────────────────────────────────────────────────┐
│ please enter the passphrase to                       │
│ protect your new key                                 │
│                                                      │
│ passphrase: ***********_____________________________ │
│                                                      │
│       <ok>                              <cancel>     │
└──────────────────────────────────────────────────────┘
```

```
┌──────────────────────────────────────────────────────┐
│ please re-enter this passphrase                      │
│                                                      │
│ passphrase: ***********_____________________________ │
│                                                      │
│       <ok>                              <cancel>     │
└──────────────────────────────────────────────────────┘
```

the gnupg manual states:

>from the perspective of security, the passphrase to unlock the private key is
one of the weakest points in gnupg (and other public-key encryption systems as
well) since it is the only protection you have if another individual gets your
private key.

so choose a good passphrase! and it's a **passphrase** not a **password** so
you can use whitespace to string multiple words together if you want.

now to finish generating the keys - generate some precious entropy (as
instructed) and you're done:
```
we need to generate a lot of random bytes. it is a good idea to perform
some other action (type on the keyboard, move the mouse, utilize the
disks) during the prime generation; this gives the random number
generator a better chance to gain enough entropy.

gpg: key 08bdff7dc22c37d1 marked as ultimately trusted
gpg: revocation certificate stored as '/home/dusan/.gnupg/openpgp-revocs.d/cf5d0cca5563381584ad977a08bdff7dc22c37d1.rev'
public and secret key created and signed.

pub   rsa4096 2019-03-20 [sc] [expires: 2019-06-18]
      cf5d0cca5563381584ad977a08bdff7dc22c37d1
uid                      dusan dimitric <dusan_dimitric@yahoo.com>
sub   rsa4096 2019-03-20 [e] [expires: 2019-06-18]
```

you can now see your newly generated key pair in the keyring:
```
$ gpg --list-keys
gpg: checking the trustdb
gpg: marginals needed: 3  completes needed: 1  trust model: pgp
gpg: depth: 0  valid:   1  signed:   0  trust: 0-, 0q, 0n, 0m, 0f, 1u
gpg: next trustdb check due at 2019-06-18
/home/dusan/.gnupg/pubring.kbx
pub   rsa4096 2019-03-20 [sc] [expires: 2019-06-18]
      cf5d0cca5563381584ad977a08bdff7dc22c37d1
uid           [ultimate] dusan dimitric <dusan_dimitric@yahoo.com>
sub   rsa4096 2019-03-20 [e] [expires: 2019-06-18]
```

notice that gnupg takes care of securely storing your private keys so you don't
have to do it manually.

if you want to change some of the key pair parameters just delete the current
key and generate a new one. you can delete a key pair with:
```
gpg --delete-secret-and-public-key dusan_dimitric@yahoo.com
```

### encryption/decryption

in order for someone to securely send you a gpg encrypted file you must send
them your public key. in order to send your public key to someone, you must
export it first:

```
$ gpg --output my_pubkey.gpg --export dusan_dimitric@yahoo.com
$ ls
my_pubkey.gpg
```

the key we exported is in binary format by default. the `--armor` flag can be
used to export the public key in an `ascii-armored` format, which makes it easy
to share your public key using email, your webpage or any other textual medium.

let's overwrite the binary public key with an ascii-armored one:
```
$ gpg --armor --output my_pubkey.gpg --export dusan_dimitric@yahoo.com
file 'my_pubkey.gpg' exists. overwrite? (y/n) y
$ ls
my_pubkey.gpg
```

in order for someone to securely send you a file with the help of `gnupg`, they
first have to import your private key and then use it to encrypt the intended
file. you can share your public key with the sender by any means that you want.
your public key is safe for anyone to see and use.

```
$ gpg --import my_pubkey.gpg
```

before using the imported public key, make sure to validate it first.  a key is
validated by verifying the key's fingerprint and then signing the key to certify
it as a valid key. 

```
$ gpg --fingerprint dusan_dimitric@yahoo.com
pub   rsa4096 2019-03-24 [sc] [expires: 2019-06-22]
      0c83 bb42 8d9b c164 9182  f5c6 9f2f 6aa3 e63e d6a0
uid           [ultimate] dusan dimitric <dusan_dimitric@yahoo.com>
sub   rsa4096 2019-03-24 [e] [expires: 2019-06-22]
```

the fingerprint here is: `0c83 bb42 8d9b c164 9182  f5c6 9f2f 6aa3 e63e d6a0`.

you must verify that the fingerprint is the same by communicating with the
public key's owner. this can be in person, over the phone or any other secure
method. if those 20 bytes match, you can go ahead and proceed with encryption
using this verified public key.

```
$ gpg --encrypt --output secret.txt.enc --recipient dusan_dimitric@yahoo.com secret.txt
$ ls
my_pubkey.gpg  secret.txt  secret.txt.enc
```

the sender will send the encrypted file to you, using whichever channel they
want. when you get the encrypted file, you can decrypt it using:
```
$ gpg --output secret.txt --decrypt secret.txt.enc
```

you will be prompted to enter the private key passphrase, and if the correct
one is entered you will have your decrypted file:
```
$ cat secret.txt
user: dusan
pass: password123
```

## verdict:
```
security : 9+
ux       : 7
```

# troubleshooting: gnupg non-ascii user identifier:

let's say you create a gnupg key pair and use non-ascii characters in the `name`
field (i used `dušan dimitrić`, with `š` and `ć` obviously being non-ascii).
doing that will cause the remove keys command not to work, along with other
unexpected bugs:

```
$ gpg --list-keys
gpg: checking the trustdb
gpg: marginals needed: 3  completes needed: 1  trust model: pgp
gpg: depth: 0  valid:   1  signed:   0  trust: 0-, 0q, 0n, 0m, 0f, 1u
gpg: next trustdb check due at 2019-06-19
/home/dusan/.gnupg/pubring.kbx
--------------------------------------
pub   rsa4096 2019-03-21 [sc] [expires: 2019-06-19]
      c5875f42bb3439d2505e032d1e93f87508bc08d0
uid           [ultimate] dušan dimitri\xc4\x20<dusan_dimitric@yahoo.com>
sub   rsa4096 2019-03-21 [e] [expires: 2019-06-19]
```

trying to remove the key pair will fail, no matter if you use the `name`,
`email` or fingerprint to identify and delete the key:
```
$ gpg --delete-secret-and-public-key dušan dimitri\xc4\x20
gpg (gnupg) 2.2.7; copyright (c) 2018 free software foundation, inc.
this is free software: you are free to change and redistribute it.
there is no warranty, to the extent permitted by law.


sec  rsa4096/1e93f87508bc08d0 2019-03-21 dušan dimitri\xc4\x20<dusan_dimitric@yahoo.com>

delete this key from the keyring? (y/n) y
this is a secret key! - really delete? (y/n) y
gpg: deleting secret key failed: a locale function failed
gpg: deleting secret subkey failed: a locale function failed
gpg: dušan: delete key failed: a locale function failed
```

easiest way to solve this is to remove all surface level files from your
`~/.gnupg` directory:
```
cd ~/.gnupg
rm *
```

now everything regarding keys and keyrings is deleted and `gnupg` will
re-create the missing files next time you run it.

**lesson learned: don't use non-ascii characters for any of your gnupg key
identifiers.**

# Bonus 1: GnuPG key management
coming soon...
# Bonus 2: GnuPG signing
coming soon...
# Bonus 3: GnuPG public key verification & _web of trust_
coming soon...
