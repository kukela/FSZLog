package xyz.kukela.fszlog

import androidx.compose.foundation.text.ClickableText
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.tooling.preview.Preview
import xyz.kukela.fszlog.ui.theme.MyApplicationTheme
import xyz.kukela.fszlog.ui.theme.darkTextMain


object PrivacyDialog {

    @Composable
    fun ShowDialog(listener: Listener?) {
        val openDialog = remember { mutableStateOf(true) }

        if (!openDialog.value) return

        val annotatedText = buildAnnotatedString {
            append("尊敬的用户欢迎使用“反赊账记录器App”在您使用前请仔细阅读")
            pushStringAnnotation(
                tag = "tag",
                annotation = "privacy"
            )
            withStyle(
                style = SpanStyle(
                    color = Color(0xFF0E9FF2),
                    fontWeight = FontWeight.Bold
                )
            ) {
                append("《隐私政策》")
            }
            pop()
            append("。点击“同意并继续”意味着您已阅读完毕并自愿遵守反赊账记录器以上协议内容。")
        }

        MyApplicationTheme {
            AlertDialog(onDismissRequest = { },
                title = {
                    Text(text = "隐私政策")
                },
                text = {
                    ClickableText(
                        text = annotatedText,
                        style = MaterialTheme.typography.bodyMedium,
                        onClick = { offset ->
                            annotatedText.getStringAnnotations(
                                tag = "tag", start = offset,
                                end = offset
                            ).firstOrNull()?.let { annotation ->
                                listener?.openWebView(annotation.item)
                            }
                        }
                    )
                },
                confirmButton = {
                    Button(onClick = {
                        openDialog.value = false
                        listener?.dialogNext()
                    }) {
                        Text(text = "同意并继续")
                    }
                },
                dismissButton = {
                    Button(
                        colors = ButtonDefaults.buttonColors(
                            containerColor = Color(0xFF7D90A9)
                        ),
                        onClick = {
                            openDialog.value = false
                            listener?.dialogExit()
                        }) {
                        Text(text = "不同意")
                    }
                }
            )
        }
    }

    interface Listener {
        fun dialogExit()
        fun dialogNext()
        fun openWebView(url: String)
    }

}

@Preview(showBackground = true)
@Composable
private fun PrivacyDialogPreview() {
    PrivacyDialog.ShowDialog(null)
}