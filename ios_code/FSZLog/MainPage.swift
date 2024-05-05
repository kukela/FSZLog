//
//  ContentView.swift
//  FSZLog
//
//  Created by kukela on 2024/5/2.
//

import SwiftUI

struct MainPage: View, PrivacyDialog.Delegate {
    
    //    @Environment(\.colorScheme) var colorScheme
    
    @State private var stateStr = "加载中..."
    @State private var isStateAlert = false
    @State private var isPrivacyAlert = false
    @State private var openPrivacyPage = false
    
    
    var body: some View {
        NavigationView {
            VStack() {
                NavigationLink(destination: PrivacyPage(), isActive: $openPrivacyPage) { EmptyView() }
                Text(stateStr)
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
            }
            .alert(isPresented: self.$isStateAlert) {
                Alert(title: Text("提示"), message: Text(stateStr))
            }
            .privacyDialog(isShow: self.$isPrivacyAlert, delegate: self)
            .onAppear() {
//                Conf.shared.setIsShowPrivacyDialog(v: true)
                if Conf.shared.isShowPrivacyDialog() {
                    isPrivacyAlert = true
                } else {
                    startApplet()
                }
            }
        }
    }
    
    func dialogExit() {
        abort()
    }
    
    func dialogNext() {
        Conf.shared.setIsShowPrivacyDialog(v: false)
        startApplet()
    }
    
    func openURL(_: String) {
        self.openPrivacyPage = true
    }
    
    func startApplet() {
        let finBundle = Conf.shared.getFinBundle()
        if finBundle == nil { return }
        let rootCtr = UIApplication.shared.fat_topViewController()
        if rootCtr == nil { return }
        
        let request = FATAppletRequest.init()
        request.appletId = "662a70d82233de000188d862"
        request.offlineFrameworkZipPath = finBundle!.path(forResource: "framework-3.3.2", ofType: "zip")
        request.offlineMiniprogramZipPath = finBundle!.path(forResource: "app-1.0.4", ofType: "zip")
        request.presentationConfig = FATAppletPresentationConfig.currentContext()
        
        FATClient().startApplet(with: request, inParentViewController: rootCtr) { (result, error) in
            if result {
                stateStr = "加载成功。"
            } else {
                stateStr = "加载失败：" + (error?.localizedDescription ?? "未知错误")
            }
            print("打开小程序:", stateStr)
            isStateAlert = true
        } closeCompletion: {
            print("关闭小程序")
            stateStr = "小程序关闭"
            //            abort()
        }
    }
    
}

#Preview {
    MainPage()
}
