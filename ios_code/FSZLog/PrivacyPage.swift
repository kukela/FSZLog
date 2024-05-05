//
//  PrivacyPage.swift
//  FSZLog
//
//  Created by kukela on 2024/5/5.
//

import SwiftUI
import WebKit

struct PrivacyPage: View {
    @ObservedObject var web = webviewModel();
    
    var body: some View {
        
        NavigationView {
            WebView(webview: web.webview)
        }.navigationBarTitle("隐私政策", displayMode: .inline)
        
    }
    
}

struct WebView: UIViewRepresentable{
    typealias UIViewType = WKWebView
    let webview: WKWebView;
    
    func makeUIView(context: Context) -> WKWebView {
        return webview;
    }
    
    func updateUIView(_ uiView: WKWebView, context: Context) {
    }
}

class webviewModel: ObservableObject{
    
    let webview: WKWebView;
    
    init() {
        self.webview = WKWebView(frame: .zero)
        
        let finBundle = Conf.shared.getFinBundle()
        let filePath = finBundle?.path(forResource: "privacy_agreement", ofType: "html")
        if filePath == nil { return }
        
        webview.load(URLRequest(url: URL(fileURLWithPath: filePath!)))
    }
}


#Preview {
    PrivacyPage()
}
