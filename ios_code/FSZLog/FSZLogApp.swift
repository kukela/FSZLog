//
//  FSZLogApp.swift
//  FSZLog
//
//  Created by kukela on 2024/5/2.
//

import SwiftUI
//import SwiftData

@main
struct FSZLogApp: App {
    
    @UIApplicationDelegateAdaptor(AppDelegate.self) var appDelegate
    
    var body: some Scene {
        WindowGroup {
            MainView()
        }
        
    }
}
