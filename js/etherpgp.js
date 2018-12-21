const ethers = require('ethers');
const pgpABI = require('./pgpABI.json');
const openpgp = require('openpgp');
const IPFS_URL = 'https://ipfs.infura.io:5001'
const ipfs = require('nano-ipfs-store').at(IPFS_URL)

etherpgp = new function () {

    this.ipfs = ipfs;

    this.init_metaMask = async function () {

        const desiredNetwork = '1'; // '1' is the Ethereum main network ID.

        let self = this;

        // Detect whether the current browser is ethereum-compatible,
        // and handle the case where it isn't:
        if (typeof window.ethereum === 'undefined') {
            alert('Looks like you need a Dapp browser to get started.');
            alert('Consider installing MetaMask!')
        } else {

            // In the case the user has MetaMask installed, you can easily
            // ask them to sign in and reveal their accounts:
            ethereum.enable()

            // Remember to handle the case they reject the request:
                .catch(function (reason) {
                    if (reason === 'User rejected provider access') {
                        // The user didn't want to sign in!
                    } else {
                        // This shouldn't happen, so you might want to log this...
                        alert('There was an issue signing you in.')
                    }
                })

                // In the case they approve the log-in request, you'll receive their accounts:
                .then(function (accounts) {
                    // You also should verify the user is on the correct network:
                    if (ethereum.networkVersion !== desiredNetwork) {
                        alert('This application requires the main network, please switch it in your MetaMask UI.')

                        // We plan to provide an API to make this request in the near future.
                        // https://github.com/MetaMask/metamask-extension/issues/3663
                    }
                    self.account = accounts[0];
                    // Once you have a reference to user accounts,
                    // you can suggest transactions and signatures:
                    // self.getPGPKey(accounts[0]).then(function (err, res) {
                    //     console.log('keys fetched');
                    // });

                });

        }

    };


    this.init_ethers = function () {
        this.ethers = ethers;
        this.provider = new ethers.providers.Web3Provider(web3.currentProvider);

        // There is only ever up to one account in MetaMask exposed
        this.signer = this.provider.getSigner();
    };

    this.init_pgp = function () {
        this.pgpContract =
            ethereum.networkVersion === "1"
                ? new ethers.Contract(
                '0xa6a52efd0e0387756bc0ef10a34dd723ac408a30',
                pgpABI,
                this.provider,
                )
                : new ethers.Contract(
                '0x9d7efd45e45c575cafb25d49d43556f43ebe3456',
                pgpABI,
                this.provider,
                );
        this.pgpKeys = {};
    };

    this.getPGPKey = async function (address) {
        console.log("Address: ", address);
        if (this.pgpKeys[address]) {
            return this.pgpKeys[address]
        } else {
            const ipfsHash = await this.pgpContract.addressToPublicKey(address);
            if (!ipfsHash) return false; // no key found
            //hashString = Buffer(ipfsHash.slice(2), 'hex').toString();
            console.log(ipfsHash);
            this.pgpKeys[address] = JSON.parse(await ipfs.cat(ipfsHash)); // hashString);
            return this.pgpKeys[address];
        }
    };


    this.registerPGPKey = async function () {
        const address = this.account;

        if (await this.getPGPKey(address)) {
            throw 'Key already set on PGP contract, should only be set once';
        }

        this.signedSeed = await this.signer.signMessage(`I hereby confirm that I am owner of ${address}`);

        const {privateKeyArmored, publicKeyArmored} = await openpgp.generateKey({
            userIds: [{address}],
            curve: 'p256', // ECC curve name, most widely supported
            passphrase: this.signedSeed,
        })
        const walletPGPKey = {privateKeyArmored, publicKeyArmored};
        this.pgpKeys[address] = walletPGPKey;
        const ipfsHash = await ipfs.add(JSON.stringify(walletPGPKey));
        return this.pgpContract.connect(this.signer)
            .addPublicKey(ipfsHash, {
                value: 0,
                gasLimit: 160000,
                gasPrice: ethers.utils.parseUnits('40', 'Gwei'),
            })
    };


    this.decryptMessage = async function (encryptedMessage, address) {
        const key = await this.getPGPKey(address);
        if (!key) {
            throw 'PGP Key not set for this address';
        }
        const {keys} = await openpgp.key.readArmored(key.privateKeyArmored);
        this.signedSeed = await this.signer.signMessage(`I hereby confirm that I am owner of ${address}`)
        const privKeyObj = keys[0];
        await privKeyObj.decrypt(this.signedSeed);
        decrypted = await openpgp
            .decrypt({
                message: await openpgp.message.readArmored(encryptedMessage),
                privateKeys: [privKeyObj],
            });
        return decrypted.data;
    };

    this.encryptMessage = async function (message, address) {
        const key = await this.getPGPKey(address);
        if (!key) {
            throw 'PGP Key not set for this address';
        }
        return openpgp
            .encrypt({
                message: openpgp.message.fromText(message), // input as Message object
                publicKeys: (await openpgp.key.readArmored(key.publicKeyArmored)).keys, // for encryption
            })
            .then(ciphertext => {
                return ciphertext.data
            })
            .catch(function (reason) {
                console.log(reason);
            })
    }

    this.init_ethers();
    this.init_pgp();
    this.init_metaMask();
};

module.exports = etherpgp;
