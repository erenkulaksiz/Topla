# Topla - Matematik Hızı Oyunu

<p align="center">
  <img src="https://i.imgur.com/TPrQ6pp.png" width="360">
  <img src="https://i.imgur.com/J1QnGH7.png" width="360">
</p>
<p align="center">
  <img src="https://i.imgur.com/Dc0Cs0a.png" width="360">
  <img src="https://i.imgur.com/4cI3Wgb.png" width="360">
</p>

---

### Repo Linkleri

- [Topla Adobe XD Design Files](./design/ui)
- [Topla React Native Application Frontend](./topla)
- [Topla Node.js Application Backend](./topla-server)
- [Compare UI design and real application](./design/ui/comparing_design)

### Important notes for React Native part

- First, download all packages using 'npm'
- Goto directory /node_modules/react-native-admob/android/src/main/java/com/sbugert/rnadmob/RNAdMobRewardedVideoAdModule.java
- Comment out line 95, change "sendEvent(EVENT_VIDEO_COMPLETED, null);" to "// sendEvent(EVENT_VIDEO_COMPLETED, null);"

- Use test ad keys for AdMob or use your own in .env file

- Make sure to change settings and rename .env_template to .env in directory /topla
- Make sure to change settings and rename keys_template.js to keys.js in root directory

- Please contact to erenkulaksz@gmail.com for build/test release problems

### Topla uygulaması sayesinde matematik işlemlerinde hızınızı arttırabilir, kendinize meydan okuyabilirsiniz.

## Özellikler:

### Dil Seçenekleri:

- İngilizce
- Türkçe

### Seçilebilir İşlemler:

- Toplama, Çıkarma, Çarpma ve Bölme

### Seçilebilir Basamak Aralığı:

- Karanlık mod desteği

- 1 basamaklıdan 4 basamaklıya.

- Sorular tamamen rastgele üretilir.

- Soruların içeriğini tamamen kendiniz ayarlayabilir veya önceden ayarlanmış zorluklara göre çözebilirsiniz.

- Soruların seçenekleri dinamik ve cevaba göre üretilir.

- Bölme ve çıkarma için ayrı alogritma kullanılır.

- Reklam gösterimini kapatmak için aylık abonelik alabilirsiniz. Bu destek sayesinde yazdığım onca satır kod için bir fincan kahve alabilirim :)

# Roadmap

- ToplaGold
- ChildPlay
- Ayarlar ve soru ayarlarındaki checkbox'lar iOS tarzı toggle ile değiştirilecek
- Operator Challenge
- Duo game / split screen

- Tasarım sıfırdan yapılacak

---

# [Changelog](https://sites.google.com/view/topla-changelog/ana-sayfa)

- [Uygulamada yapilan degisiklikleri buradan goruntuleyebilirsiniz](https://sites.google.com/view/topla-changelog/ana-sayfa)
