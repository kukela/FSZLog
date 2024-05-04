//
//  ContentView.swift
//  FSZLog
//
//  Created by kukela on 2024/5/2.
//

import SwiftUI
//import SwiftData

struct MainView: View, PrivacyDialog.Delegate {
    
//    @Environment(\.colorScheme) var colorScheme
    
    @State private var stateStr = "加载中..."
    @State private var isStateAlert = false
    @State private var isPrivacyAlert = true
    
    
    var body: some View {
        VStack() {
            Text(stateStr)
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            Button("测试") {
                isPrivacyAlert = true
            }
        }
        .alert(isPresented: self.$isStateAlert) {
            Alert(title: Text("提示"), message: Text(stateStr))
        }
        .privacyDialog(isShow: self.$isPrivacyAlert, delegate: self)
        .onAppear() {
//            startApplet()
        }
       
    }
    
    func dialogExit() {
        UIApplication.shared.perform(#selector(NSXPCConnection.suspend))
    }
    
    func dialogNext() {
        startApplet()
    }
    
    func openURL(_: String) {
        print("----")
    }
    
    func startApplet() {
        let finPath = Bundle.main.path(forResource:"fin", ofType:"bundle")
        if(finPath == nil) { return }
        let finBundle = Bundle.init(path: finPath!)
        if(finBundle == nil) { return }
        let rootCtr = UIApplication.shared.fat_topViewController()
        if(rootCtr == nil) { return }
        
        let request = FATAppletRequest.init()
        request.appletId = "662a70d82233de000188d862"
        request.offlineFrameworkZipPath = finBundle!.path(forResource: "framework-3.3.2", ofType: "zip")
        request.offlineMiniprogramZipPath = finBundle!.path(forResource: "app-1.0.4", ofType: "zip")
        request.presentationConfig = FATAppletPresentationConfig.currentContext()
        
        FATClient().startApplet(with: request, inParentViewController: rootCtr) { (result, error) in
            if(result) {
                stateStr = "加载成功。"
            }else {
                stateStr = "加载失败：" + (error?.localizedDescription ?? "未知错误")
            }
            print("打开小程序:", stateStr)
            isStateAlert = true
        } closeCompletion: {
            print("关闭小程序")
            stateStr = "小程序关闭"
        }
    }
    
}

#Preview {
    MainView()
}
