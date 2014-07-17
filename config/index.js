var _ = require("underscore");
// merchant configuration, Note: all parameters are case sensitive
// 1qianbao remote api configuration.
// user:13901734000  pwd:1qaz2wsx   pay pwd:3edc4rfv
// 18221851560   1qaz2wsx   支付密码：3edc4rfv
// 18000000005  1qaz2wsx     3edc4rfv
var qianbaoCfg = {
    local: {
        orderRemoteUri: "https://test2-www.1qianbao.com:4443/ffastpay",
        merchantId: "900000000009",
        merchantKey: "dc2eb86cfd1e4134bd2368bc28820adf",
        cachier: "https://test2-www.1qianbao.com:7443/cashier/{transId}" // cacheier request.
    },
    production: {
        orderRemoteUri: "https://mapi.1qianbao.com/ffastpay",
        merchantId: "900000000256",
        merchantKey: "a85f52756a13402191155ee8a7b3f309",
        cachier: "https://test2-www.1qianbao.com:7443/cashier/{transId}" // cacheier request.
    }
};
qianbaoCfg.staging = qianbaoCfg.local;


var merchantCfg = {
    charset: "UTF-8",
    version: "1.0.0", //消息版本号
    signMethod: "SHA-256",
    orderCurrency: "CNY", // 人民币
    transType: "001", //交易类型-001[消费]
    transCode: "0014",//0001", //交易代码 0001[既时支付],0014:[扫码付]
    backEndUrl: "", //后台通知URL
    frontEndUrl: "", //前台通知URL
    sameOrderFlag: "N" // 当前订单是否允许重复
};
// site configuration.
var config = {
    appName: "express-demo",
    defaultDataProvider: "mongo"
};
//
var serverCfg = {
    local: {
        mode: "local",
        port: 3000,
        mongo: {
            host: "127.0.0.1",
            port: 27017
        }
    },
    staging: {
        mode: "staging",
        port: 4000,
        mongo: {
            host: '127.0.0.1',
            port: 27017
        }
    },
    production: {
        mode: "production",
        port: 5000,
        mongo: {
            host: "127.0.0.1",
            port: 27017
        }
    }
};

module.exports = function(mode) {
    var env = 'local';
    var use = serverCfg[mode || process.argv[2] || env] || serverCfg[env];
    var use = _.extend(use, config, merchantCfg, qianbaoCfg[env]);
    return use;
};
