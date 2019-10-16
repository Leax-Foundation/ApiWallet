const Lightwallet = require('eth-lightwallet');
const isNullOrUndefined = require('util');

class SeedController {
    constructor(){

    }

    generate(req, res){
       
        if(isNullOrUndefined.isNullOrUndefined(req.params.point)){
            let error = { 
                isError: true,
                msg: "Error read parameter <point>"
            };
            res.status(400).json(error);
        }

        let seedPoint = req.params.point.toString();	
        let data = { 
            isError: false,
            seed: Lightwallet.keystore.generateRandomSeed(seedPoint) 
        };
        res.status(200).json(data);
    }

    showSeed(req, res){
        if(isNullOrUndefined.isNullOrUndefined(req.body.wallet))
        {
            let error = { 
                isError: true,
                msg: "Error read Wallet Json"
            };
            res.status(400).json(error);
        }	
        if(isNullOrUndefined.isNullOrUndefined(req.body.password))
        {
            let error =  { 
                isError: true,
                msg: "Error read parameter <password>"
            };
            res.status(400).json(error);
        }
                                
        let walletJson = JSON.stringify(req.body.wallet);	
        let ks = Lightwallet.keystore.deserialize(walletJson);
        let password = req.body.password.toString();
        ks.keyFromPassword(password, function(err, pwDerivedKey) {	
            if(ks.isDerivedKeyCorrect(pwDerivedKey))
            {
                let seeds = ks.getSeed(pwDerivedKey,ks.getAddresses[0])
                let data = { 
                    isError: false,
                    seed: seeds
                };
                res.status(200).json(data);
            }
            else{	
                let error = {
                    isError: true,
                    msg: 'Password incorret'						
                };			
                res.status(400).json(error);
            }
        });
    }
}

module.exports = SeedController;