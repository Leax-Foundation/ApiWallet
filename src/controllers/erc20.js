const Lightwallet = require("eth-lightwallet");
const isNullOrUndefined = require("util");
const Web3 = require("web3");
const HookedWeb3Provider = require("hooked-web3-provider");
const async = require("async");
const Request = require("request");
const abiJson = require("../files/contract.json");

let web3 = new Web3();
let contractAddress = 0x3bcfe4786ce5669fe06282ebf11afe3d0f606cda;
let contractAddr = "0x3bCFE4786CE5669FE06282eBf11AfE3d0F606CdA";
let contractAbi = abiJson;
let contractInstance = web3.eth.contract(contractAbi).at(contractAddress);
let txutils = Lightwallet.txutils;
let signing = Lightwallet.signing;
let txOptions = Lightwallet.txOptions;

let hostWeb3 = "https://mainnet.infura.io/7xNw0DpR7VrQxYmSs303";
//const hostWeb3 = "https://rinkeby.infura.io/7xNw0DpR7VrQxYmSs303";

let Apikeys = [
  "V4PQ2PWQPG3HX8I9J7N159HZX9KY6UH1MR",
  "41ZR3MY5C7F4UC44MXBSNRUVTBAQAJG7I9",
  "Q2SR7V7HNF7NUSH629HBJ1F9JQMFEWZK3F"
];

class Erc20Controller {
  constructor() {}

  /**
   * function responsible for the generation of wallet.json where the seed is received from '/seed/:point'
   */
  create(req, res) {
    if (isNullOrUndefined.isNullOrUndefined(req.body.seed)) {
      let error = {
        isError: true,
        msg: "Error read parameter <seed>"
      };
      res.status(400).json(error);
    }

    if (isNullOrUndefined.isNullOrUndefined(req.body.password)) {
      let error = {
        isError: true,
        msg: "Error read parameter <password>"
      };
      res.status(400).json(error);
    }
    let paramPassword = req.body.password.toString();
    let paramSeed = req.body.seed.toString();
    let numAddr = 1;

    Lightwallet.keystore.createVault(
      {
        password: paramPassword,
        seedPhrase: paramSeed,
        //random salt
        hdPathString: "m/44'/60'/0'/0"
      },
      function(err, ks) {
        ks.keyFromPassword(paramPassword, function(err, pwDerivedKey) {
          if (ks.isDerivedKeyCorrect(pwDerivedKey)) {
            ks.generateNewAddress(pwDerivedKey, numAddr);
            let data = {
              wallet: ks
            };
            res.status(200).json(data);
          } else {
            let error = {
              isError: true,
              msg: "Password incorret"
            };
            res.status(400).json(error);
          }
        });
      }
    );
  }

  /**
   * function responsible for validate if password is compatible with wallet
   */
  loginWithJson(req, res) {
    if (isNullOrUndefined.isNullOrUndefined(req.body.wallet)) {
      let error = {
        isError: true,
        msg: "Error read Wallet Json"
      };
      res.status(400).json(error);
    }
    if (isNullOrUndefined.isNullOrUndefined(req.body.password)) {
      let error = {
        isError: true,
        msg: "Error read parameter <password>"
      };
      res.status(400).json(error);
    }
    let walletJson = JSON.stringify(req.body.wallet);
    let ks = Lightwallet.keystore.deserialize(walletJson);
    let password = req.body.password.toString();
    ks.keyFromPassword(password, function(err, pwDerivedKey) {
      if (ks.isDerivedKeyCorrect(pwDerivedKey)) {
        let data = {
          isError: false
        };
        res.status(200).json(data);
      } else {
        let error = {
          isError: true,
          msg: "Password incorret"
        };
        res.status(400).json(error);
      }
    });
  }

  /**
   * function responsible for validate if password is compatible with wallet
   */
  loginWithSeed(req, res) {
    if (isNullOrUndefined.isNullOrUndefined(req.body.seed)) {
      let error = {
        isError: true,
        msg: "Error read parameter <seed>"
      };
      res.status(400).json(error);
    }
    if (isNullOrUndefined.isNullOrUndefined(req.body.password)) {
      let error = {
        isError: true,
        msg: "Error read parameter <password>"
      };
      res.status(400).json(error);
    }

    let numAddr = 1;
    let pass = req.body.password.toString();
    let randomSeed = req.body.seed.toString();
    Lightwallet.keystore.createVault(
      {
        password: pass,
        seedPhrase: randomSeed,
        hdPathString: "m/44'/60'/0'/0"
      },
      function(err, ks) {
        ks.keyFromPassword(pass, function(err, pwDerivedKey) {
          if (ks.isDerivedKeyCorrect(pwDerivedKey)) {
            ks.generateNewAddress(pwDerivedKey, numAddr);
            let data = {
              wallet: ks
            };
            res.status(200).json(data);
          } else {
            let error = {
              isError: true,
              msg: "Password incorret"
            };
            res.status(400).json(error);
          }
        });
      }
    );
  }

  /**
   * function responsible for return wallet for seed
   */
  recoverySeed(req, res) {
    if (isNullOrUndefined.isNullOrUndefined(req.body.wallet)) {
      let error = {
        isError: true,
        msg: "Error read Wallet Json"
      };
      res.status(400).json(error);
    }
    if (isNullOrUndefined.isNullOrUndefined(req.body.password)) {
      let error = {
        isError: true,
        msg: "Error read parameter <password>"
      };
      res.status(400).json(error);
    }
    let walletJson = JSON.stringify(req.body.wallet);
    let ks = Lightwallet.keystore.deserialize(walletJson);
    let password = req.body.password.toString();
    ks.keyFromPassword(password, function(err, pwDerivedKey) {
      if (ks.isDerivedKeyCorrect(pwDerivedKey)) {
        let data = {
          isError: false,
          seed: ks.getSeed(pwDerivedKey)
        };
        res.status(200).json(data);
      } else {
        let error = {
          isError: true,
          msg: "Password incorret"
        };
        res.status(400).json(error);
      }
    });
  }

  /**
   * Function responsible for returning account balance in token contract ERC20
   */
  getTokenBalance(req, res) {
    if (isNullOrUndefined.isNullOrUndefined(req.body.wallet)) {
      let msg = { msg: "Error read Wallet Json" };
      res.status(400).json(msg);
    }
    if (isNullOrUndefined.isNullOrUndefined(req.body.password)) {
      let msg = { msg: "Error read parameter <password>" };
      res.status(400).json(msg);
    }
    let walletJson = JSON.stringify(req.body.wallet);
    let ks = Lightwallet.keystore.deserialize(walletJson);
    let password = req.body.password.toString();
    ks.keyFromPassword(password, function(err, pwDerivedKey) {
      if (!err) {
        let web3Provider = new HookedWeb3Provider({
          host: hostWeb3,
          transaction_signer: ks
        });
        web3.setProvider(web3Provider);
        let addr = ks.getAddresses()[0];
        let contractData = contractInstance.balanceOf.getData(addr);
        web3.eth.call(
          {
            to: contractAddr, // Contract address, used call the token balance of the address in question
            data: contractData // Combination of contractData and tknAddress, required to call the balance of an address
          },
          function(err, result) {
            if (result) {
              let tokens = web3.toBigNumber(result).toString(); // Convert the result to a usable number string
              let balance = {
                address: addr,
                balance: web3.fromWei(tokens, "ether")
              };
              res.status(200).json(balance);
            } else {
              let error = {
                isError: true,
                msg: err
              };
            }
          }
        );
      } else {
        let error = {
          isError: true,
          msg: err
        };
        res.status(400).json(error);
      }
    });
  }

  /**
     * Function responsible for returning account balance in ETH 

     */
  getEthBalance(req, res) {
    if (isNullOrUndefined.isNullOrUndefined(req.body.wallet)) {
      let error = {
        isError: true,
        msg: "Error read Wallet Json"
      };
      res.status(400).json(error);
    }
    if (isNullOrUndefined.isNullOrUndefined(req.body.password)) {
      let error = {
        isError: true,
        msg: "Error read parameter <password>"
      };
      res.status(400).json(error);
    }
    let walletJson = JSON.stringify(req.body.wallet);
    let ks = Lightwallet.keystore.deserialize(walletJson);
    let password = req.body.password.toString();
    ks.keyFromPassword(password, function(err, pwDerivedKey) {
      if (!err) {
        let addresses = ks.getAddresses();
        let web3Provider = new HookedWeb3Provider({
          host: hostWeb3,
          transaction_signer: ks
        });
        web3.setProvider(web3Provider);

        async.map(addresses, web3.eth.getBalance, function(err, balances) {
          async.map(addresses, web3.eth.getTransactionCount, function(
            err,
            nonces
          ) {
            let balance = {
              isError: false,
              address: addresses[0],
              balance: balances[0] / 1.0e18
            };
            res.status(200).json(balance);
          });
        });
      } else {
        let error = {
          isError: true,
          msg: err
        };
        res.status(400).json(error);
      }
    });
  }

  /**
   * Function responsible for send Token Contract
   */
  sendToken(req, res) {
    if (isNullOrUndefined.isNullOrUndefined(req.body.wallet)) {
      let error = {
        isError: true,
        msg: "Error read Wallet Json"
      };
      res.status(400).json(error);
    }
    if (isNullOrUndefined.isNullOrUndefined(req.body.password)) {
      let error = {
        isError: true,
        msg: "Error read parameter <password>"
      };
      res.status(400).json(error);
    }
    if (isNullOrUndefined.isNullOrUndefined(req.body.to)) {
      let error = {
        isError: true,
        msg: "Error read parameter <to>"
      };
      res.status(400).json(error);
    }
    if (isNullOrUndefined.isNullOrUndefined(req.body.gasLimit)) {
      let error = {
        isError: true,
        msg: "Error read parameter <gasLimit>"
      };
      res.status(400).json(error);
    }
    if (isNullOrUndefined.isNullOrUndefined(req.body.gasPrice)) {
      let error = {
        isError: true,
        msg: "Error read parameter <gasPrice>"
      };
      res.status(400).json(error);
    }
    if (isNullOrUndefined.isNullOrUndefined(req.body.value)) {
      let error = {
        isError: true,
        msg: "Error read parameter <value>"
      };
      res.status(400).json(error);
    }

    let walletJson = JSON.stringify(req.body.wallet);
    let ks = Lightwallet.keystore.deserialize(walletJson);
    let password = req.body.password.toString();
    ks.keyFromPassword(password, function(err, pwDerivedKey) {
      if (ks.isDerivedKeyCorrect(pwDerivedKey)) {
        if (ks.getAddresses()[0] == req.body.to) {
          let error = {
            isError: true,
            msg: "Invalid Recipient"
          };
          res.status(400).json(error);
        }

        let web3Provider = new HookedWeb3Provider({
          host: hostWeb3,
          transaction_signer: ks
        });
        web3.setProvider(web3Provider);

        let nonceNumber = parseInt(
          web3.eth.getTransactionCount(ks.getAddresses()[0], "pending")
        );
        let gasprices = parseInt(req.body.gasPrice) * 1000000000;
        let gasLimit = parseInt(req.body.gasLimit);
        let sendingAddr = ks.getAddresses()[0];
        let value = parseFloat(req.body.value) * 1.0e18; //Address wallet
        let txOptions = {
          nonce: web3.toHex(nonceNumber),
          gasLimit: web3.toHex(gasLimit),
          gasPrice: web3.toHex(gasprices),
          to: contractAddr
        };
        let arg = Array.prototype.slice.call([req.body.to, value]);
        let rawTx = txutils.functionTx(contractAbi, "transfer", arg, txOptions);
        let signedSetValueTx = signing.signTx(
          ks,
          pwDerivedKey,
          rawTx,
          sendingAddr
        );
        web3.eth.sendRawTransaction("0x" + signedSetValueTx, function(
          err,
          hash
        ) {
          if (!isNullOrUndefined.isNullOrUndefined(err)) {
            let error = {
              isError: true,
              msg: err
            };
            res.status(400).json(error);
          }
          if (!isNullOrUndefined.isNullOrUndefined(hash)) {
            let data = {
              isError: false,
              hash: hash
            };
            res.status(200).json(data);
          } else {
            let error = {
              isError: true,
              msg: "return hash is null"
            };
            res.status(400).json(error);
          }
        });
      } else {
        let error = {
          isError: true,
          msg: "Password incorret"
        };
        res.status(400).json(error);
      }
    });
  }

  /**
   * Function responsible for send ETH
   */
  sendEth(req, res) {
    if (isNullOrUndefined.isNullOrUndefined(req.body.wallet)) {
      let error = {
        isError: true,
        msg: "Error read Wallet Json"
      };
      res.status(400).json(error);
    }
    if (isNullOrUndefined.isNullOrUndefined(req.body.password)) {
      let error = {
        isError: true,
        msg: "Error read parameter <password>"
      };
      res.status(400).json(error);
    }
    if (isNullOrUndefined.isNullOrUndefined(req.body.to)) {
      let error = {
        isError: true,
        msg: "Error read parameter <to>"
      };
      res.status(400).json(error);
    }
    if (isNullOrUndefined.isNullOrUndefined(req.body.gasLimit)) {
      let error = {
        isError: true,
        msg: "Error read parameter <gasLimit>"
      };
      res.status(400).json(error);
    }
    if (isNullOrUndefined.isNullOrUndefined(req.body.gasPrice)) {
      let error = {
        isError: true,
        msg: "Error read parameter <gasPrice>"
      };
      res.status(400).json(error);
    }
    if (isNullOrUndefined.isNullOrUndefined(req.body.value)) {
      let error = {
        isError: true,
        msg: "Error read parameter <value>"
      };
      res.status(400).json(error);
    }

    let walletJson = JSON.stringify(req.body.wallet);
    let ks = Lightwallet.keystore.deserialize(walletJson);
    let password = req.body.password.toString();
    ks.keyFromPassword(password, function(err, pwDerivedKey) {
      if (ks.isDerivedKeyCorrect(pwDerivedKey)) {
        if (ks.getAddresses()[0] == req.body.to) {
          let error = {
            isError: true,
            msg: "Invalid Recipient"
          };
          res.status(400).json(error);
        }

        let web3Provider = new HookedWeb3Provider({
          host: hostWeb3,
          transaction_signer: ks
        });
        web3.setProvider(web3Provider);

        console.log("web3");

        let sendingAddr = ks.getAddresses()[0];
        let nonceNumber = parseInt(
          web3.eth.getTransactionCount(sendingAddr.toString(), "pending")
        );

        txOptions = {};
        txOptions.to = req.body.to;
        txOptions.gasLimit = req.body.gasLimit;
        txOptions.gasPrice = parseInt(req.body.gasPrice) * 1000000000;
        txOptions.value = parseFloat(req.body.value) * 1.0e18;
        txOptions.nonce = nonceNumber;

        let valueTx = txutils.valueTx(txOptions);
        let signedValueTx = signing.signTx(
          ks,
          pwDerivedKey,
          valueTx,
          sendingAddr
        );
        web3.eth.sendRawTransaction("0x" + signedValueTx, function(err, hash) {
          if (!isNullOrUndefined.isNullOrUndefined(err)) {
            let error = {
              isError: true,
              msg: err
            };
            res.status(400).json(error);
          }
          if (!isNullOrUndefined.isNullOrUndefined(hash)) {
            let data = {
              isError: false,
              hash: hash
            };
            console.log(data);
            res.status(200).json(data);
          } else {
            let error = {
              isError: true,
              msg: "return hash is null"
            };
            res.status(400).json(error);
          }
        });
      } else {
        let error = {
          isError: true,
          msg: "Password incorret"
        };
        res.status(400).json(error);
      }
    });
  }

  /**
   * Function responsible for show privatekey
   */
  exportPrivateKey(req, res) {
    if (isNullOrUndefined.isNullOrUndefined(req.body.wallet)) {
      let error = {
        isError: true,
        msg: "Error read Wallet Json"
      };
      res.status(400).json(error);
    }
    if (isNullOrUndefined.isNullOrUndefined(req.body.password)) {
      let error = {
        isError: true,
        msg: "Error read parameter <password>"
      };
      res.status(400).json(error);
    }

    let walletJson = JSON.stringify(req.body.wallet);
    let ks = Lightwallet.keystore.deserialize(walletJson);
    let password = req.body.password;
    ks.keyFromPassword(password, function(err, pwDerivedKey) {
      if (ks.isDerivedKeyCorrect(pwDerivedKey)) {
        let privatekey = ks.exportPrivateKey(
          ks.getAddresses()[0],
          pwDerivedKey
        );
        let data = {
          isError: false,
          privatekey: privatekey
        };
        res.status(200).json(data);
      } else {
        let error = {
          isError: true,
          msg: "Senha Invalida"
        };
      }
    });
  }

  /**
   * Function responsible for convert address compartible with address system simple
   */
  checksumAddress(req, res) {
    if (isNullOrUndefined.isNullOrUndefined(req.body.wallet)) {
      let error = {
        isError: true,
        msg: "Error read Wallet Json"
      };
      res.status(400).json(error);
    }
    if (isNullOrUndefined.isNullOrUndefined(req.body.password)) {
      let error = {
        isError: true,
        msg: "Error read parameter <password>"
      };
      res.status(400).json(error);
    }

    let walletJson = JSON.stringify(req.body.wallet);
    let ks = Lightwallet.keystore.deserialize(walletJson);
    let password = req.body.password.toString();
    ks.keyFromPassword(password, function(err, pwDerivedKey) {
      if (ks.isDerivedKeyCorrect(pwDerivedKey)) {
        let checksumAddress = web3.toChecksumAddress(
          ks.getAddresses()[0].toString()
        );
        let data = {
          isError: false,
          address: checksumAddress
        };
        res.status(200).json(data);
      } else {
        let error = {
          isError: true,
          msg: "Senha Invalida"
        };
      }
    });
  }

  /**
   * Function responsible for return list all transaction
   */
  getTransactions(req, res) {
    if (isNullOrUndefined.isNullOrUndefined(req.params.address)) {
      let error = {
        isError: true,
        msg: "Error read parameter <address>"
      };
      res.status(400).json(error);
    }

    let address = req.params.address;
    let rondom = Math.floor(Math.random() * 3);

    let endpoint =
      "https://api.etherscan.io/api?module=account&action=txlist&address=" +
      address +
      "&startblock=0&endblock=99999999&sort=asc&apikey=" +
      Apikeys[rondom];
    Request(endpoint, function(err, response, body) {
      if (!err) {
        let transactions = JSON.parse(body);
        let Result = [];
        for (let index = transactions.result.length - 1; index >= 0; index--) {
          let isMyTokenValue = "";

          if (transactions.result[index].to == contractAddress)
            isMyTokenValue = "1";
          else isMyTokenValue = "0";

          var transaction = {
            blockNumber: transactions.result[index].blockNumber,
            timeStamp: transactions.result[index].timeStamp,
            hash: transactions.result[index].hash,
            nonce: transactions.result[index].nonce,
            from: transactions.result[index].from,
            to: transactions.result[index].to,
            value: transactions.result[index].value,
            gas: transactions.result[index].gas,
            gasPrice: transactions.result[index].gasPrice,
            isError: transactions.result[index].isError,
            cumulativeGasUsed: transactions.result[index].cumulativeGasUsed,
            gasUsed: transactions.result[index].gasUsed,
            confirmations: transactions.result[index].confirmations,
            isMyToken: isMyTokenValue
          };
          Result.push(transaction);
        }
        let data = {
          isError: false,
          transactions: Result
        };
        res.status(200).json(data);
      } else {
        let error = {
          isError: true,
          msg: err
        };
        res.status(400).json(error);
      }
    });
  }
}

module.exports = Erc20Controller;
