var _ = require("underscore");
// merchant configuration, Note: all parameters are case sensitive
// 1qianbao remote api configuration. 
// 中实名：18512340005 邬凝安 430181197303161748 pwd:asdf1234 光大贷记：3568370012340001  pay pwd: zxcv1234    -----new account for test2
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
        cachier: "https://www.1qianbao.com/cashier/{transId}" // cacheier request.
    }
};
qianbaoCfg.staging = qianbaoCfg.local;


var merchantCfg = {
    charset: "UTF-8",
    version: "1.0.0", //消息版本号
    signMethod: "SHA-256",
    orderCurrency: "CNY", // 人民币
    transType: "001", //交易类型-001[消费]  005: 查询
    transCode: "0014", //0001", //交易代码 0001[既时支付],0014:[扫码付]
    backEndUrl: "", //后台通知URL
    frontEndUrl: "http://192.168.14.145:3000/order/detail/{0}", //前台通知URL
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
        virtualDir: "",
        mongo: {
            host: "127.0.0.1",
            port: 27017
        }
    },
    staging: {
        mode: "staging",
        port: 4000,
        virtualDir: "",
        mongo: {
            host: '127.0.0.1',
            port: 27017
        }
    },
    production: {
        mode: "production",
        port: 8000,
        virtualDir: "qrcode", // the application virtual directory.  http://www.1qianbao.com/qrcode/order/list
        mongo: {
            host: "127.0.0.1",
            port: 27017
        }
    }
};

module.exports = function(mode) {
    var env = 'production';
    var use = serverCfg[mode || process.argv[2] || env] || serverCfg[env];
    var use = _.extend(use, config, merchantCfg, qianbaoCfg[env]);
    return use;
};
