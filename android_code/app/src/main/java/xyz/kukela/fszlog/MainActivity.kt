package xyz.kukela.fszlog

import android.content.ClipboardManager
import android.content.Context
import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import com.finogeeks.lib.applet.client.FinAppClient.appletApiManager
import com.finogeeks.lib.applet.sdk.api.request.IFinAppletRequest
import xyz.kukela.fszlog.ui.theme.MyApplicationTheme


class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val request = IFinAppletRequest.Companion.fromAppId("662a70d82233de000188d862")
        // 打开小程序
        appletApiManager.startApplet(this, request, null)

//        setContent {
//            MyApplicationTheme {
//                // A surface container using the 'background' color from the theme
//                Surface(
//                    modifier = Modifier.fillMaxSize(),
//                    color = MaterialTheme.colorScheme.background
//                ) {
//                    Greeting("Android")
//                }
//            }
//        }
    }
}

@Composable
fun Greeting(name: String, modifier: Modifier = Modifier) {
    Text(
        text = "Hello $name!",
        modifier = modifier
    )
}

@Preview(showBackground = true)
@Composable
fun GreetingPreview() {
    MyApplicationTheme {
        Greeting("Android")
    }
}