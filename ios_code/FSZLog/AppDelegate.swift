//
//  AppDelegate.swift
//  FSZLog
//
//  Created by kukela on 2024/5/2.
//

class AppDelegate: NSObject, UIApplicationDelegate {
    
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
        
        self.initFunApp()
        
        return true
    }
    
    private func initFunApp() {
        let storeConfig = FATStoreConfig()
        storeConfig.sdkKey = "RoD3eJmOwrcXAwhqN2rhJLscAb47O260ikXGAklpBkY="
        storeConfig.sdkSecret = "e11da60e07364490"
        storeConfig.apiServer = "https://api.finclip.com"
        storeConfig.cryptType = FATApiCryptType.MD5
        storeConfig.enablePreloadFramework = false
        
        let config = FATConfig(storeConfigs: [storeConfig])
        // config.appletDebugMode = FATAppletDebugMode.enable
        config.appletIntervalUpdateLimit = 0
        config.disableGetSuperviseInfo = true
        config.backgroundFetchPeriod = 0
        
        let uiConfig = FATUIConfig()
        uiConfig.hideForwardMenu = true
        uiConfig.hideSettingMenu = true
        uiConfig.autoAdaptDarkMode = true
        uiConfig.hideBackToHome = true
        uiConfig.hideClearCacheMenu = true
        uiConfig.hideRefreshMenu = true
        uiConfig.hideTransitionCloseButton = true
        
        let capsuleConfig = uiConfig.capsuleConfig
        capsuleConfig?.hideCapsuleCloseButton = true
        capsuleConfig?.capsuleCornerRadius = 15.5
        
        do {
            try FATClient.shared().initWith(config, uiConfig: uiConfig)
        } catch let err {
            print("初始化失败：\(err)")
            return
        }
        
        FATClipBoardComponent.register()
        
    }
    
}
