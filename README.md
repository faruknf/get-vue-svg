# **Convert Svgs to Vue Components**

```bash
#Input                 #Output

svgs                   src/components/svgs
|home.svg              |HomeSvg.vue
|logo.svg              |LogoSvg.vue
|social                |social
    |-instagram.svg         |-InstagramSvg.vue
    |-twitter.svg           |-TwitterSvg.vue
    |dark                   |dark
       |-instagram.svg        |-InstagramSvg.vue
```

## Usage

```bash
npm -D install get-vue-svg
```

You can create a command in your package.json

```bash
"scripts": {
  "svg": "get-vue-svg <your-svg-folder-path>"
},

# npm run svg
```

or launch the following command if you installed it globally.

```bash
get-vue-svg <your-svg-folder-path>
```

The command above will create your components, then you can use the component after you imported it.

```js
<VueSvg width="40px" fill="blue" stroke="white" strokewidth="1" />
```

## Props

The default values of the following props are their original values, but if the SVG does not have the following properties, the following values will be the default of the SVG props.

| props       | default |
| ----------- | ------- |
| width       | 24      |
| height      | 100%    |
| fill        | none    |
| stroke      | none    |
| strokewidth | 1       |
| opacity     | 1       |

### License

MIT
