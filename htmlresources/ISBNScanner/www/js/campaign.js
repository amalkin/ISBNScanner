angular.module('ngAdobeCampaign', [])

.factory('AdobeCampaignConfig', function() {
    
    var campaignConfigKeys = ['marketingHost', 'trackingHost', 'integrationKey'];
    
    var defaultCampaignConfig = {
            marketingHost: "https://vm119.adobedemo.com",
            trackingHost: "https://vm119.adobedemo.com",
            integrationKey: "60C2E5D0-4048-4B22-9F32-20E904338B42"
        };

    var defaultCampaignParams = {
        userId: "pmital@adobe.com"
    };
    
    var campaignConfig = {};
    var campaignParams = {};
    
    function init() {          
        copy(defaultCampaignConfig, campaignConfig);
        copy(defaultCampaignParams, campaignParams);
    }
    
    init();
    
    function formData() {
        var formData = {};
       
        copy(campaignConfig, formData);
        copy(campaignParams, formData);
        
        return formData;
    }
    
    function copy(sourceObj, destinationObj) {
        for (key in sourceObj) {
            if (sourceObj.hasOwnProperty(key)) {
                var value = sourceObj[key];
                destinationObj[key] = value;
            }
        }
    }
    
    function createCampaignConfig(completeFormData) {
        campaignConfig['marketingHost'] = completeFormData['marketingHost'];
        campaignConfig['trackingHost'] = completeFormData['trackingHost'];
        campaignConfig['integrationKey'] = completeFormData['integrationKey'];
    }
    
    function createCampaignParams(completeFormData) {
        for (key in completeFormData) {
            if (!isCampaignConfigKey(key) && completeFormData.hasOwnProperty(key)) {
                var value = completeFormData[key];
                campaignParams[key] = value;
            }
        }
    }
    
    
    function isCampaignConfigKey(key) {
        return campaignConfigKeys.indexOf(key) > -1;
    }
    
    
    return {
   
     getFormData: function() {
        return formData();
     },
        
     saveForm: function(completeFormData){
         createCampaignConfig(completeFormData);
         createCampaignParams(completeFormData);
     },
        
     clearForm: function(){
         campaignConfig = {};
         campaignParams = {};
     },
        
    resetForm: function(){
         init();
     },
    
     addCampaignConfig: function(key, value) {
        campaignConfig[key] = value;
      },
     
     getCampaignConfig: function(){
         return campaignConfig;
     },
        
     addCampaignParams: function(key, value) {
         campaignParams[key] = value;
     },
    
     getCampaignParams: function() {
         return campaignParams;
     }
        
    };
    
  })

.factory('AdobeCampaignService', function(AdobeCampaignConfig) {

    function registerNotifications() {
        
        var pushNotification = window.plugins.Campaign;
        console.log("[AdobeCampaignService.registerNotifications] Campaign serviceName: " + pushNotification.serviceName);

        var campaignConfig = AdobeCampaignConfig.getCampaignConfig();

        var campaignParams = AdobeCampaignConfig.getCampaignParams();

        try {
            if (device.platform == 'android' || device.platform == 'Android') {
                pushNotification.register(successHandler, errorHandler, {"senderID":"Project ID","ecb":"onNotificationGCM",campaignConfig: campaignConfig, campaignParams: campaignParams}); // required!
            } else {
                console.log("[AdobeCampaignService.registerNotifications] registering: ");
                
                var options = {"badge":"true", "sound":"true", "alert":"true", "ecb":"onNotificationAPN", campaignConfig: campaignConfig, campaignParams: campaignParams};
                
                pushNotification.register(successHandler, errorHandler, options);    // required!
            }
            console.log('[AdobeCampaignService.registerNotifications] done registering');
        } catch (err) {
            console.log('[AdobeCampaignService.registerNotifications] There was an error on this page '+err.message);
            navigator.notification.alert(txt, alertCallback, 'Error', 'Okay');
        }
    }

    function unregisterNotifications() {
        var pushNotification = window.plugins.Campaign;
        console.log("[AdobeCampaignService.unregisterNotifications] Campaign serviceName: " + pushNotification.serviceName);
        try {
            pushNotification.unregister(successHandler, errorHandler);    // required!
            console.log('[AdobeCampaignService.unregisterNotifications] done un-registering');
        } catch (err) {
            console.log('[AdobeCampaignService.unregisterNotifications] There was an error on this page '+err.message);
            navigator.notification.alert(txt, alertCallback, 'Error', 'Okay');
        }
    }
    
    function alertCallback() {
        console.log('Notification acknowledged');
    }

    function successHandler(result) {
        console.log("[AdobeCampaignService.successHandler] result: " + result);
    }

    function errorHandler(error) {
        console.log("[AdobeCampaignService.errorHandler] result: " + error);
    }
    
    return {
      registerNotifications: function() {
         registerNotifications();
     },
        
     unregisterNotifications: function() {
         unregisterNotifications();
     }
    };
});