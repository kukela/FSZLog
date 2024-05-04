//
//  PrivacyDialog.swift
//  FSZLog
//
//  Created by kukela on 2024/5/4.
//

import SwiftUI

struct PrivacyDialog: ViewModifier {
    @Binding var isShow: Bool
    //    var dialogExit:  () -> Void
    var delegate: Delegate?
    
    
    func body(content: Content) -> some View {
        
        ZStack {
            content.zIndex(0)
            
            if isShow {
                Rectangle()
                    .fill(.clear)
                    .background(
                        Color(UIColor.opaqueSeparator).opacity(0.8)
                            .edgesIgnoringSafeArea(.all)
                            .onTapGesture {
                                isShow = false
                            }
                    )
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                    .zIndex(1)
                
                ZStack {
                    VStack {
                        Text("隐私政策")
                            .font(.title)
                            .padding(.vertical)
                        
                        Text("尊敬的用户欢迎使用“反赊账记录器App”在您使用前请仔细阅读[《隐私政策》](xyz.kukela.fszlog://privacy)。点击“同意并继续”意味着您已阅读完毕并自愿遵守反赊账记录器以上协议内容。")
                            .onOpenURL(perform: { url in
                                if(url.host == "privacy") {
                                    delegate?.openURL(url.host!)
                                }
                            })
                        
                        HStack(alignment: .center) {
                            Button("不同意") {
                                isShow = false
                                delegate?.dialogExit()
                            }
                            .frame(maxWidth: .infinity)
                            .padding()
                            
                            Button("同意并继续") {
                                isShow = false
                                delegate?.dialogNext()
                            }
                            .foregroundColor(.red)
                            .frame(maxWidth: .infinity)
                            .padding()
                        }
                    }
                    .padding(.horizontal, 25)
                    .background(Color(UIColor.secondarySystemBackground))
                    .cornerRadius(12)
                    .shadow(radius: 8)
                    .padding(.horizontal, 20)
                }
                .transition( .asymmetric(
                    insertion: .move(edge: .bottom),
                    removal: .move(edge: .bottom)
                ))
                .ignoresSafeArea()
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .zIndex(2)
            }
            
        }
        .ignoresSafeArea(.keyboard)
        .animation(.easeInOut, value: isShow)
    }
    
    protocol Delegate {
        func dialogExit() -> Void
        func dialogNext() -> Void
        func openURL(_: String) -> Void
    }
    
}


extension View {
//action: @escaping () -> Void
    func privacyDialog(isShow: Binding<Bool>, delegate: PrivacyDialog.Delegate) -> some View {
        ModifiedContent(content: self, modifier: PrivacyDialog(isShow: isShow, delegate: delegate))
    }
}

//#Preview {
//     var isShow = true
//    ZStack() {
//    }
//    .privacyDialog(isShow: $isShow)
//}
