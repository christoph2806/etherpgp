# EtherPGP

[EtherPGP](http://christoph2806.github.io/etherpgp) is a simple static dApp to encrypt messages by Ethereum Addresses and PGP.
The basic concept is borrowed from [Airswap](https://www.airswap.io/) from their recent [Keyspaces]() subproject. 
When I stumbled over it I thought that it would be something useful also outside the Airswap context, and so this simple
static page was coded. 

## Preview

[![Freelancer Preview](https://startbootstrap.com/assets/img/templates/freelancer.jpg)](https://blackrockdigital.github.io/startbootstrap-freelancer/)

**[View Live Preview](https://blackrockdigital.github.io/startbootstrap-freelancer/)**

## Status
((status badges here))

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/christoph2806/etherpgp/blob/master/LICENSE)
[![npm version](https://img.shields.io/npm/v/startbootstrap-freelancer.svg)]()
[![Build Status](https://travis-ci.org/BlackrockDigital/startbootstrap-freelancer.svg?branch=master)]()
[![dependencies Status](https://david-dm.org/BlackrockDigital/startbootstrap-freelancer/status.svg)]()
[![devDependencies Status](https://david-dm.org/BlackrockDigital/startbootstrap-freelancer/dev-status.svg)]()

## Forking and Cloning

* Clone the repo: `git clone https://github.com/christoph2806/etherpgp.git`
* [Fork, Clone, or Download on GitHub](https://github.com/christoph2806/etherpgp)

## Usage

### Basic Usage
1. First **create your keypair** for PGP. The PGP private key is deterministically derived from the private key of an 
Ethereum Address. It's simply the 164-bit string which is the result of signing a special message containing this 
address. The signing is done by Metamask so the dApp never has to handle the private key.
The public key is then derived from the private key with openpgp.js and stored in a very simple 
[9-line-smart contract](https://etherscan.io/address/0xa6a52efd0e0387756bc0ef10a34dd723ac408a30#code) in a 
`mapping (address => string)` mapping.  
The nice thing is that you don't need to backup you private key because for decryption it is always *ad-hoc*
generated from the ethereum address by signing the same special message with Metamask. 

1. For **encryption**, we simply use the public key which is read from the smart contract and encrypt the
message with openpgp.js. 
The encrypted message can then be send by any channel you like. 
Be aware that not all messenger applications preserve the message in a way that it can be decrypted afterwards.

1. For **decryption**, we derive the private key *on-the-fly* by signing the special message with Metamask.
With the private key we can then decrypt the message.


## Bugs and Issues

Have a bug or an issue with this dApp? [Open a new issue](https://github.com/christoph2806/etherpgp/issues). 

## About

The basic idea is courtesy [Airswap.io](https://airswap.io) as described in their 
[Medium Post](https://medium.com/fluidity/keyspace-end-to-end-encryption-using-ethereum-and-ipfs-87b04b18156b).
The template for this page is the "Freelancer" Template from [Start Bootstrap](https://startbootstrap.com).

Implementation as a standalone, static page by [Christoph Mussenbrock](https://github.com/christoph2806), 
Co-Founder of [Etherisc](https://etherisc.com).

Start Bootstrap is an open source library of free Bootstrap templates and themes. All of the free templates 
and themes on Start Bootstrap are released under the MIT license, which means you can use them for any purpose, 
even for commercial projects.

* https://startbootstrap.com
* https://twitter.com/SBootstrap

Start Bootstrap was created by and is maintained by **[David Miller](http://davidmiller.io/)**, 
Owner of [Blackrock Digital](http://blackrockdigital.io/).

* http://davidmiller.io
* https://twitter.com/davidmillerskt
* https://github.com/davidtmiller

Start Bootstrap is based on the [Bootstrap](http://getbootstrap.com/) framework created by 
[Mark Otto](https://twitter.com/mdo) and [Jacob Thorton](https://twitter.com/fat).

## Copyright and License

Copyright for the template 2013-2018 Blackrock Digital LLC. Code released under the 
[MIT](https://github.com/BlackrockDigital/startbootstrap-freelancer/blob/gh-pages/LICENSE) license.  
Copyright for the implementation of the message encryption 2018 Airswap.io and Christoph Mussenbrock. Code released 
under the [GPL 3.0](https://github.com/christoph2806/etherpgp/blob/gh-pages/LICENSE) license.