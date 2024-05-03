package xyz.kukela.fszlog

import android.content.Intent
import android.os.Bundle
import android.widget.Space
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.tooling.preview.Preview
import com.blankj.utilcode.util.FileUtils
import com.blankj.utilcode.util.LogUtils
import com.blankj.utilcode.util.ResourceUtils
import com.finogeeks.lib.applet.client.FinAppClient.appletApiManager
import com.finogeeks.lib.applet.interfaces.FinCallback
import com.finogeeks.lib.applet.sdk.api.request.IFinAppletRequest
import xyz.kukela.fszlog.ui.theme.MyApplicationTheme
import xyz.kukela.fszlog.ui.theme.darkTextMain

class MainActivity : ComponentActivity() {

    val stateStr = mutableStateOf("加载中...")

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContent {
            Greeting()
        }

        if (Conf.isShowPrivacyDialog()) {
            setContent {
                PrivacyDialog.ShowDialog(object : PrivacyDialog.Listener {
                    override fun dialogExit() {
                        finish()
                    }

                    override fun dialogNext() {
                        Conf.setIsShowPrivacyDialog(false)
                        startApp()
                    }

                    override fun openWebView(url: String) {
                        startActivity(Intent(this@MainActivity, PrivacyActivity::class.java))
                    }
                })
            }
        } else {
            startApp()
        }

//        startActivity(Intent(this, PrivacyActivity::class.java))
    }

    // 打开小程序
    private fun startApp() {
        stateStr.value = "加载中..."
        val filePath = filesDir.path
        val libPath = "$filesDir/framework-3.3.2.zip"
        val appPath = "$filesDir/app-1.0.4.zip"
        if (!FileUtils.isFileExists(libPath) || !FileUtils.isFileExists(appPath)) {
            ResourceUtils.copyFileFromAssets("fin", filePath)
        }
        appletApiManager.startApplet(
            this,
            IFinAppletRequest.Companion.fromAppId("662a70d82233de000188d862")
                .setOfflineParams(libPath, appPath)
                .setProcessMode(IFinAppletRequest.ProcessMode.SINGLE)
                .setTaskMode(IFinAppletRequest.TaskMode.SINGLE),
            object : FinCallback<String?> {
                override fun onSuccess(msg: String?) {
                    LogUtils.dTag("startApplet", msg)
                    stateStr.value = "加载成功。"
                    finish()
                }

                override fun onError(code: Int, error: String) {
                    LogUtils.eTag("startApplet", code, error)
                    stateStr.value = "加载失败：$code $error"
                    Toast.makeText(this@MainActivity, "打开失败 $code $error", Toast.LENGTH_LONG)
                        .show()
                }

                override fun onProgress(status: Int, err: String?) {
                    stateStr.value = "加载中：$status $err"
                    LogUtils.dTag("startApplet", status, err)
                }
            }
        )

    }

    @Composable
    fun Greeting() {
        MyApplicationTheme() {
            Column(
                modifier = Modifier
                    .fillMaxHeight()
                    .fillMaxWidth(),
                verticalArrangement = Arrangement.Center,
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Spacer(modifier = Modifier.statusBarsPadding())
                Text(text = stateStr.value, style = MaterialTheme.typography.bodyLarge)
            }
        }
    }

}


@Preview(showBackground = true)
@Composable
fun MainActivityPreview() {
    MainActivity().Greeting()
}
