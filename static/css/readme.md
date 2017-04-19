Make a RTL vertion of _BootStrap V4_

```
  cp ./bootstrap.css bootstrap-rtl.css
  sed -i 's/left/_left_/g' ./bootstrap-rtl.css
  sed -i 's/right/left/g' ./bootstrap-rtl.css
  sed -i 's/_left_/right/g' ./bootstrap-rtl.css

  sed -i 's/.mr-/.mright-/g' ./bootstrap-rtl.css
  sed -i 's/.ml-/.mr-/g' ./bootstrap-rtl.css
  sed -i 's/.mright-/.ml-/g' ./bootstrap-rtl.css

  sed -i 's/.pr-/.pright-/g' ./bootstrap-rtl.css
  sed -i 's/.pl-/.pr-/g' ./bootstrap-rtl.css
  sed -i 's/.pright-/.pl-/g' ./bootstrap-rtl.css
```
A hake:
  html {
    font-family: sans-serif;
    line-height: 1.15;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
  }
Remember to remove bootstrap.css.map line
