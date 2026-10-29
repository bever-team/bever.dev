import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import '@fontsource-variable/geist'
import '@fontsource-variable/geist-mono'
import LiveDemo from './LiveDemo.vue'
import PreAlphaBanner from './PreAlphaBanner.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, {
    'layout-top': () => h(PreAlphaBanner),
    'home-hero-after': () => h(LiveDemo),
  }),
}
