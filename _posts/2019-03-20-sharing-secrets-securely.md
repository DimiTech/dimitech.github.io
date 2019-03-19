# Sharing Secrets Securely

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
super secret text
password123
_EOF_
$ ls
secret.txt
```

## 1. Zip

`zip` is a utility that comes with most popular UNIX derivatives, so no need to
even install anything. You can check if you have it by running:

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

### UX and Security

`zip` is extremely easy to use and in most cases requires no installation or
setup.

There are a couple of problems with this method though. It only works well if
the person that you want to share the secret file is physically near you so you
can actually verbally share the decryption password.

You can also use this method to share secret files with people that are not in
your physical vicinity - by sending them the password over some different
channel than the one that you used to send the encrypted file to them.

Let's say that you have sent the compressed/encrypted file to the recipient in
an Email attachment. There are a couple of ways to send the password, here are
2 ideas:

1) Call them using some E2E encrypted VoIP application and tell them the password
2) Send the password using some E2E encrypted chat application, preferrably with message auto-expiry

One of the big security risks with symmetric, password based secret sharing are
keyloggers and audio surveillance (smartphones, laptop or hidden mics), so you
should keep in mind that this is not the best way to share information that is
a matter of life or death.

#### Verdict:
```
Security : 5
UX       : 10
```

## 2. ccrypt

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

### UX and Security

`ccrypt` is extremely simple and easy to set up and use.

It is more secure than `zip` compression because of the fact that it overrides
the original file on disk, leaving no way to recover it afterwards.

Aside from that - it shares the same security challenges as the previous method
since we're again dealing with passwords.

#### Verdict:
```
Security : 6.5
UX       : 10
```
