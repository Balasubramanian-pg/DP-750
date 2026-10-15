import DefaultTheme from 'vitepress/theme'
import QuizViewer from './QuizViewer.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('QuizViewer', QuizViewer)
  }
}
