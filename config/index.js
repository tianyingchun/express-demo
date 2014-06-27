var _ = require("underscore");
// merchant configuration, Note: all parameters are case sensitive
var merchantCfg = {
    cachier: "https://test2-www.1qianbao.com:7443/cashier/{transId}",
    merchantId: "900000000009", //商户号
    merchantKey: "9286ed7a54e94c5e96820896d02c412d", //商户约定密钥
    charset: "UTF-8",
    version: "1.0.0", //消息版本号
    signMethod: "SHA-256",
    orderCurrency: "CNY", // 人民币
    transType: "001", //交易类型-001[消费]
    transCode: "0001", //交易代码 0001[既时支付]
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
    var use = serverCfg[mode || process.argv[2] || 'local'] || serverCfg['local'];
    var use = _.extend(use, config, merchantCfg);
    return use;
};
