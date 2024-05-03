package xyz.kukela.fszlog.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Typography
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable

@Composable
fun MyApplicationTheme(
    content: @Composable () -> Unit
) {
    val t = Typography()
    MaterialTheme(
        colorScheme = darkColorScheme(
            primary = main,
            secondary = darkTextMain,
            background = darkPageColor,
            surface = darkPageColor,
        ),
        typography = Typography(
            displayLarge = t.displayLarge.copy(color = darkTextMain),
            displayMedium = t.displayMedium.copy(color = darkTextMain),
            displaySmall = t.displaySmall.copy(color = darkTextMain),
            titleLarge = t.titleLarge.copy(color = darkTextMain),
            titleMedium = t.titleMedium.copy(color = darkTextMain),
            titleSmall = t.titleSmall.copy(color = darkTextMain),
            headlineLarge = t.headlineLarge.copy(color = darkTextMain),
            headlineMedium = t.headlineMedium.copy(color = darkTextMain),
            headlineSmall = t.headlineSmall.copy(color = darkTextMain),
            bodyLarge = t.bodyLarge.copy(color = darkTextMain),
            bodyMedium = t.bodyMedium.copy(color = darkTextMain),
            bodySmall = t.bodySmall.copy(color = darkTextMain),
            labelLarge = t.labelLarge.copy(color = darkTextMain),
            labelMedium = t.labelMedium.copy(color = darkTextMain),
            labelSmall = t.labelSmall.copy(color = darkTextMain),
        ),
        content = content
    )
}