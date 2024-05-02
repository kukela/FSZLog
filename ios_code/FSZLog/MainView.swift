//
//  ContentView.swift
//  FSZLog
//
//  Created by kukela on 2024/5/2.
//

import SwiftUI
//import SwiftData

struct MainView: View {
    
    
    var body: some View {
        FAView()
    }
    
}

struct FAView: UIViewControllerRepresentable {
    typealias UIViewControllerType = FAViewController
    
    func makeUIViewController(context: Context) -> FAViewController {
        return  FAViewController()
    }

    func updateUIViewController(_ uiViewController: UIViewControllerType, context: Context) {
    }
}

#Preview {
    MainView()
}
