import DefaultTheme from 'vitepress/theme'
import LayoutWrapper from './LayoutWrapper.vue'
import QuizViewer from './QuizViewer.vue'
import FaqSection from './FaqSection.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: LayoutWrapper,
  enhanceApp({ app }) {
    app.component('QuizViewer', QuizViewer)
    app.component('FaqSection', FaqSection)
  }
}
