//
//  Conf.swift
//  FSZLog
//
//  Created by kukela on 2024/5/5.
//

class Conf {
    static let shared = Conf()
    
    private let sp = UserDefaults.standard
    
    func isShowPrivacyDialog() -> Bool {
        if sp.value(forKey: "isShowPrivacyDialogKey") == nil {
            sp.set(true, forKey: "isShowPrivacyDialogKey")
        }
        return sp.bool(forKey: "isShowPrivacyDialogKey")
    }
    
    func setIsShowPrivacyDialog(v: Bool) {
        sp.set(v, forKey: "isShowPrivacyDialogKey")
    }
    
    func getFinBundle() -> Bundle? {
        let finPath = Bundle.main.path(forResource:"fin", ofType:"bundle")
        if finPath == nil { return nil }
        return Bundle.init(path: finPath!)
    }
    
}
