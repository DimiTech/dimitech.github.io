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
easiest to use to most secure and harder to use.
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

# 1. Zip

`zip` is a utility that comes with most popular UNIX derivatives, so there is 
most likely no need to even install anything. You can check if you have it by
running:

```bash
zip --version
```

In order to transfer the secret file securely to another person we can `zip`
compress it and encrypt the compressed file with a simple password:

```bash
$ zip -e secret.zip secret.txt
Enter password:
Verify password:
  adding: secret.txt (stored 0%)
$ ls
secret.txt secret.zip
```

Remove the original secret file, since we are going to derive it from the
zip package:
```bash
$ rm secret.txt
```

Now let's reverse the process and unzip/decrypt:
```bash
$ unzip secret.zip
Archive:  secret.zip
[secret.zip] secret.txt password:
 extracting: secret.txt
$ ls
secret.txt secret.zip
```

And remove the zip file in order to clean up:
```bash
$ rm secret.zip
```

That's as simple as it gets.

## UX and Security

`zip` is extremely easy to use and in most cases requires no installation or
setup.

There are a couple of problems with this method though. It only works well if
the person that you want to share the secret file is physically near you so you
can verbally share the decryption password with them.

You can also use this method to share secret files with people that are not in
your physical vicinity - by sending them the password over some different
channel than the one that you used to send the encrypted file to them.

Let's say that you have sent the compressed/encrypted file to the recipient in
an Email attachment. There are a couple of ways to pretty securely send the
decryption password, here are 2 ideas:

1. Call them using some E2E encrypted VoIP application and tell them the password
2. Send the password using some E2E encrypted chat application, preferrably with message auto-expiry

One of the big security risks with symmetric, password based secret sharing are
keyloggers and audio surveillance (smartphones, laptop or hidden mics), so you
should keep in mind that this is not the best way to share information that is
a matter of life or death.

## Verdict:
```
Security : 5
UX       : 10
```

# 2. ccrypt

`ccrypt` is a nice and easy tool designed for secret sharing.

Go to http://ccrypt.sourceforge.net/ and install `ccrypt` on your machine if
you don't have it already.

To encrypt, use `ccencrypt` and enter an encryption password which will be
used for decryption later:
```bash
$ ccencrypt ./secret.txt
Enter encryption key:
Enter encryption key: (repeat)
$ ls
secret.txt.cpt
```

Once you encrypt the file, the original is rewritten by the newly created
encrypted file - `secret.txt.cpt`.

In order to decrypt - use `ccdecrypt` which will prompt you for the password
that you entered during encryption.

```bash
$ ccdecrypt secret.txt.cpt
Enter decryption key:
$ ls
secret.txt
```

## UX and Security

`ccrypt` is extremely simple and easy to set up and use.

It is more secure than `zip` compression because of the fact that it overrides
the original file on disk, leaving no way to recover it afterwards.

Aside from that - it shares the same security challenges as the previous method
since we're again dealing with passwords.

## Verdict:
```
Security : 6.5
UX       : 10
```

# 3. OpenSSL/LibreSSL

**OpenSSL** has recieved some pretty negative publicity in the past because of
its shortcomings (see - [heartbleed](http://heartbleed.com/)). The programmers
who worked on it dispersed which made the **OpenSSL** development stop. That's
why we will use **LibreSSL** instead.

As [the LibreSSL website](https://www.libressl.org/) states:

> LibreSSL is a version of the TLS/crypto stack forked from OpenSSL in 2014, with
goals of modernizing the codebase, improving security, and applying best
practice development processes.

## Installation

**OpenSSL** comes with most UNIX-like derivatives, and some of them have upgraded
to **LibreSSL**.

The [LibreSSL GitHub README](https://github.com/libressl-portable/portable#compatibility-with-openssl) says:

> LibreSSL is API compatible with OpenSSL 1.0.1, but does not yet include all
new APIs from OpenSSL 1.0.2 and later. LibreSSL also includes APIs not yet
present in OpenSSL. The current common API subset is OpenSSL 1.0.1.

What this means, for the purpose of this article, is that you can use either
**OpenSSL** or **LibreSSL**. Commands I use below are the same for both.

If neither one of those are present on your system, the installation is pretty
straight-forward for both, so pick one (**LibreSSL** if you can't decide) and
let's get on with it.

## Usage - Simple

Let's start with the simplest possible example, using the AES-256 cypher.

```
$ openssl enc -aes-256-ctr -in secret.txt -out secret.txt.enc
enter aes-256-ctr encryption password:
Verifying - enter aes-256-ctr encryption password:
```

We now have an encrypted file that we can send to the recepient.
```
$ ls
secret.txt     secret.txt.enc
```

#TODO: Add a real way to delete/overwrite files.
Notice that the original file is still there. Let's (naively) delete it:
```
$ rm secret.txt
```

Use the `-d` flag to decrypt and enter the decryption password:
```
$ openssl enc -aes-256-ctr -d -in secret.txt.enc -out secret.txt
enter aes-256-ctr decryption password:
$ cat secret.txt
USER: dusan
PASS: password123
```

This is as simple as it gets and it's not much more secure than using `zip`.

It can be made more secure by using and **AES key** and that would prevent brute
force attacks.

# TODO: Write how to do this!

## Usage - Normal

### Generating an asymmetric key pair

**Up until now we have been dealing with `symmetric` encryption - meaning that
both parties share a same key, which is used both for encryption and decryption.**

**From this point forward, we are going to use `asymmetric` encryption, meaning
that there are 2 keys involved - one for encryption (public key) and the other one
for decryption (private key).**

Let's start by generating the **private/public** key pair.

I'll generate an **RSA 4096 bit** private key first:
```
$ openssl genrsa -out privkey.pem 4096
```

**NOTICE:** The private key should be kept in a very safe place! Never share it
with anyone. It should absolutely always stay only on your machine. I will go
one step forward and encrypt the private key itself with a password:
```
$ openssl rsa -in privkey.pem -aes-256-ctr -out privkey.pem.enc
```

#TODO: Add a real way to delete/overwrite files.

Delete the unencrypted private key (naively):
```
$ rm privkey.pem
```

Now, for the second part, I derive the **public key** from the previously created
and encrypted **private key**:
```
$ openssl rsa -in privkey.pem.enc -pubout -out pubkey.pem
```

### Encryption/Decryption

If you want someone to send you an encrypted file, you need to give them your
public key. Use a "secure" channel transfer it to them.

Now, the other person (who also has **LibreSSL** or **OpenSSL** installed) can use
your public key to encrypt a file and send it to you:
```
$ openssl rsautl -encrypt -in secret.txt -pubin -inkey pubkey.pem -out secret.txt.enc
```

After you receive the encrypted file, use your encrypted private key to decrypt
it:
```
$ openssl rsautl -decrypt -in secret.txt.enc -out secret.txt -inkey privkey.pem.enc
Enter pass phrase for privkey.pem.enc:
```

Enter the password for decrypting your private key and you're done!

```
$ cat secret.txt
USER: dusan
PASS: password123
```

## Verdict:

**Normal usage**:
```
Security : 5.5
UX       : 8
```

**Simple usage**:
```
Security : 9
UX       : 7
```

# 4. GnuPG

