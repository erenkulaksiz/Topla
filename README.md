# Topla - Matematik Hızı Oyunu

<p align="center">
  <img src="https://i.imgur.com/TPrQ6pp.png" width="360">
  <img src="https://i.imgur.com/J1QnGH7.png" width="360">
</p>
<p align="center">
  <img src="https://i.imgur.com/Dc0Cs0a.png" width="360">
  <img src="https://i.imgur.com/4cI3Wgb.png" width="360">
</p>

### Repo Linkleri

- [Topla Adobe XD Design Files](./design/ui)
- [Topla React Native Application Frontend](./topla)
- [Topla Node.js Application Backend](./topla-server)
- [Compare UI design and real application](./design/ui/comparing_design)

### Topla uygulaması sayesinde matematik işlemlerinde hızınızı arttırabilir, kendinize meydan okuyabilirsiniz.

- React Native & React Redux bağlantısı
- Modüler component sistemi ve basit prop kontrolü
- Stillerin ayrılmasıyla modüler stiller

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

# Changelog

> Roadmap

- ToplaGold
- ChildPlay

> 01/07/2021
> Topla (v1.32)

- Sunucu tarafı iyileştirmeleri
- Node.js sunucusu artık Amazon AWS EC2'de çalıştırılıyor
- .env dosyasında dev mode false olsa bile localhost'a bağlanmaya çalışılması giderildi

> 01/07/2021
> Topla (v1.31)

- Reklam gösteriminde internet yoksa yüklenmemesi düzeltildi

> 29/06/2021
> 30/06/2021
> 01/07/2021
> Topla (v1.30)

- Bakım modu eklendi. Uygulama başlarken bakım modunda olunup olunmadığını kontrol ediyor
- Soru çözümü bağladığında durdurma butonuna basıldığında alttan modal'ın çıkmaması sorunu düzeltildi
- Soru çözümü sayfası karanlık mod'a uygun hale getirildi
- Sonuçlar sayfası karanlık mod'a uygun hale getirildi
- API'de action_desc'in loglanmaması düzeltildi
- En üstteki view'lar artık safeareaview'a geçirildi böylece çıkıntılı ekranı olan ekranlar için uyumlu olacak
- Topla v1.30 Google play market'e yüklendi ve test ediliyor #TODO: satın alımlar
- Soru ayarlarında reklamların gösterilmesi düzeltildi
- Doğru & Yanlış soru çözümüne ses efekti eklendi
- Soft update uyarısı varken yükleniyor yazısı gelmesi giderildi

- Changelog dosyası, README.md dosyasına alındı ve root'tan silindi

> 26/06/2021
> 27/06/2021
> 28/06/2021
> Topla (v1.29)

- Ayarlar kısmındaki UID yazısı ortalandı ve versiyon bilgisi eklendi
- Ayarlar kısmındaki yazılar karanlık mod'a uyumlu hale getirildi
- Ayarlara kendi ismimi ekledim & üstüne tıklayınca github profilimi açıyor
- Arkaplanda API'ye maksimum yapılacak deneme sayısı .env dosyasına eklendi ve configden çekiliyor
- Internet yoksa api'ye deneme yapılamama sorunu giderildi
- API'ye yapılacak deneme etkin olduğuna dair bilgi .env dosyasına eklendi artık configden çekiliyor
- API'ye yapılan denemelerin sıklığı artık .env dosyasından çekiliyor
- ⚡ Redux-persist ile yapılan bütün ayarlar cihaza kaydediliyor
- ⚡ React-native-async-storage eklendi
- Koyu mod eğer uygulama içerisindeki ayarlardan değiştirilirse ilk uygulama başlangıcında öyle kalıyor & kaydediliyor
- Koyu mod ayarı cihaza kaydediliyor
- Geçiş reklamı artık dinamik yükleniyor, uygulama ilk başladığında ve her reklam geçişinde arkaplanda yükleniyor & artık çok hızlı çalışıyor
- Uygulama başlangıcında artık yükleniyor alerti gösteriliyor
- Reklamları kaldır sayfası koyu mod uyumlu hale getirildi
- Uygulama başlamadan önce internet kapalıysa ve uygulama açılırken internet açılırsa reklamların yüklenmemesi düzeltildi
- Soru sonuçlarında ana sayfaya dön butonu daha güzel hale getirildi
- İletişim sayfasının kalkmasıyla reducer'da iletişim api stateleri kaldırıldı & api bağlantısı kesildi
- Artık her uygulamaya girişi kişinin uuid'sine göre loglanıyor
- Her soru çözümüne başlandığında loglanıyor
- Loglarda kullanıcının şu anda premium'a sahip olup olmadığı kaydediliyor
- Eğer kullanıcıda premium varsa reklamların uygulama arkaplanında yüklenmesi kaldırıldı
- Soru çözümü başladığında soru ayarları log ile api'ye gönderiliyor

> 22/06/2021
> 25/06/2021
> Topla (v1.28)

- Soru çözümü başlamadan önce tam ekran reklam gösterimi yapılıyor
- Reklamların key'leri .env dosyasına alındı ve config ile çekiliyor. #TODO: Keylerin hepsini reducer'a bağla.
- Soru üretiminde yazılan bazı spagetti kodlar düzeltildi
- Reklam gösterimlerinde artık kullanıcının premium'a sahip olup olmadığı kontrol ediliyor & ona göre gösteriliyor
- Uygulama için Google Play Console satın alındı
- Server kısmında contact kısmı tamamen kaldırıldı ve collection silindi
- Artık cihaz sunucuya kayıt olduğunda uygulamanın en güncel versiyonu veri olarak client'e aktarılıyor
- Cihaz hardupdate versiyonu ile uyumsuz ise uygulama açılmıyor ve uyarı veriliyor
- Cihaz softupdate versiyonu ile uyumsuz ise uygulama açılıyor ancak uyarı veriliyor
- Modallerin hepsi state yerine reducer kullanıyor
- Eğer cihaz banlandıysa uygulama açılmaz hale getirildi

> 20/06/2021
> 21/06/2021
> Topla(v1.27)

- .gitignore dosyasının içeriği düzeltildi
- Ana sayfada soru başlangıç kısımlarına snap özelliği eklendi
- Ayarlar kısmındaki debug butonu kaldırıldı
- ⚡ React-native-awesome-alerts eklendi
- Bütün alertler daha güzel hale getirildi
- Kodda gereksiz kısımlar kaldırıldı (App.js)
- Veritabanı bağlantıları için kullanılan kullanıcı adı ve şifre "./keys.js" dosyasına alındı, örnek bir template "./keys_template.js" olarak konuldu
- Uygulama içi kullanılan environment değişkenleri ".env" dosyası gitignore'ye eklendi ve ".env_template" eklendi (Hassas bilgileri gizlemek için)
- Soru çözülürken geri tuşuna basıldığında açılan alert'te geri butonuna basılırsa geri gelmeme sorunu çözüldü
- Ayarlar kısmı karanlık mod'a uygun hale getirildi
- Soru ayarlarında belirtilen süresi geçen sorular artık boş olarak nitelendiriliyor ve özet kısmında boş olarak gözüküyor
- Soru ayarlarından her bir soru başına düşen süre belirlenebiliyor
- Full ekran reklam için hazırlıklar

> 19/06/2021 - Topla(v1.26)

- API Reducer'da bilginin state'ye aktarılamamısı sorunu çözüldü.
- Uygulama artık arkaplanda eğer internet varsa ve api token alınamadıysa 5 kere 3 saniye aralıkla sunucuya bağlanmayı deniyor bağlanamazsa iptal ediyor
- Soru ayarlarında sayı aralığının negatife dönmesi engellendi
- Soru çeşitleri belirli bir dosyada değil artık reducer'da yani değiştirilebilir hale getirildi
- İletişim sayfası kaldırıldı, onun yerine mail ile direkt iletişim eklendi

> 16/06/2021 - Topla(v1.25)

- Soru seçenekleri artık tamamen cevaba bağlı geliyor (dinamik seçenek üretimi)
- Dokunulabilir butonların opaklığı ayarlandı
- Soru ayarlarında sayı aralığını arttırma ve azaltma (+10 -10 kısmı) dinamik hale getirildi
- Uygulama başlayınca oluşan bir bellek sızıntısı kaldırıldı

> 14/06/2021 - Topla(v1.24)

- Performans iyileştirmeleri
- Kodda temizlik

> 12/06/2021 - Topla(v1.23)

- Uygulama sadece portre modunda çalışır halde ayarlandı
- Uygulamanın tasarımları baştan aşağı karanlık mod için baştan yapıldı
- Uygulamada artık karanlık mod çalışıyor
- Karanlık mod, hem otomatik olarak cihazın ayarlarından hem de manuel olarak ayarlardan ayarlanabiliyor

> 11/06/2021 - Topla(v1.22)

- Reducer'da performans iyileştirmeleri
- Firebase Crashlytics ve Analytics için uygulama içi testler
- Uygulama içi performans testleri
- Redux Reducer tamamen baştan yazıldı & parçalara bölündü
- Uygulamada performans iyileştirmeleri (500ms~)

> 10/06/2021 - Topla(v1.21)

- Uygulamaya Firebase Analytics eklendi
- Uygulamaya Firebase Crashlytics eklendi

> 10/06/2021 - Topla(v1.20)

- Soru sonuçlarında özet kısmı eklendi
- Soru sonuçlarında her soru kaç saniye sürdüğü yazdırılıyor
- Özet kısmında toplam doğru - yanlış - boş sayısı yazdırılıyor
- Soru aralarındaki sayaç düzeltildi, artık baştan başlamıyor
- Node.js backend kısmında API_TOKEN olmayan Contact istekleri artık reddediliyor
- Backend kısmında performans ve güvenlik iyileştirmeleri
- Reklam gösterimleri tamamen çalışıyor
- Soru sayfasında arkaplanda performans iyileştirmeleri ve kodu toparlama yapıldı
- Backend kısmında Contact mesajı gönderilirse ve önceden 3den fazla mesaj aynı UUID ve token üstünden gönderildiyse istek reddediliyor (spam)
- Cihazda internet var ve sunucuya bağlanılamıyor & token alınamıyorsa uygulama arkaplanda her 3 saniyede bir sunucuya istek gönderiyor
- Uygulama API_TOKEN almadan önce 2 saniye bekliyor & cihazda internetin olup olmadığını kontrol ediyor
- Ayarlardaki TOKEN yazısı kaldırıldı
- Reducer'a uygulamanın son versionu ile ilgili verileri çekecek bir bilgi kısmı (API.APP) eklendi
- API.js dosyası silindi ve Reducer ile işlemler yapılmaya başlandı

> 09/06/2021 - Topla(v1.0)

- Sorular için sayaç artık çalışıyor
- Soru sayfasının kodları baştan düzeltildi

> 07/06/2021 - Topla(v1.0) - Topla Server(v1.0)

- Commit sayıları yerine versiyona geçiş yapıldı.
- Sunucu tarafında artık gelen kayıt isteklerinde API_TOKEN üretiliyor, token göndermeyen istekler reddediliyor
- Reklam gösterimleri Admob ile çalışıyor
- Token doğru çalışıyor

> 07/06/2021 - Commit 38

- Apiye UUID ve diğer bilgiler gönderildiğinde yoksa kaydediliyor varsa geri gönderiliyor
- Reklam gösterimi için hazırlıklar
- İletişim bölümü için hazırlıklar

> 06/06/2021 - Commit 37

- Api bağlantısı yapıldı
- Apiyle iletişim için Redux kullanılıyor

> 06/06/2021 - Commit 36 -- Commit 40

- README.md güncellendi (Commit 36 -- Commit 40)
- Node.js sunucusu için ilk hazırlıklar & veritabanı bağlantısı yapıldı
- Veritabanına veri yazılabiliyor & veri okunabiliyor
- Topla uygulamasının tabanı için Api.js tabanı oluşturuldu & bağlantı yapılacak (TEST EDİLMEDİ)

> 03/06/2021 - Commit 35

- Soru ayarları artık soruların varsayılan hallerine göre ayarlanıyor
- Çok Zor modu eklendi (4 basamaklı)
- App.js React Hooks'a göre çevrildi
- Oyun modlarında basamak sayıları, soru sayıları, seçenek sayıları eklendi
- Bölme işlemlerinde sayıların kopyası gelmesi ve 1 gelmesi kaldırıldı

> 02/06/2021 - Commit 34

- README.md güncellendi
- ./design/ui klasörüne UI tasarımı ile uygulama karşılaştıran ekran görüntüleri eklendi
- #TODO: Soru ayarlarında maksimum sayı aralığı en az 10 en fazla 100 olacak şekilde ayarlandı (1000 de olabilir) (eğer sayı 100'den büyükse +10 kısmı +100 olsun, eğer sayı 100 ise +10 -10 olsun)
- Topla v1.0 hazırlıkları, #TODO: İletişim & Aboneliği Geri Yükle & Reklamları Kaldır butonları işlevsel olacak
- Soru içeriği ve basamak yazıları tekrar eski haline getirildi
- Ana ekranda tasarım değiştiği için ekran görüntülerini sıfırdan değiştirildi
- Soru çözümünde bölümlü işlemlerde küsüratlı sayıların gelmesi çözüldü. Artık sayı aralığında rastgele soruluyor
- Performans sorunlarını çözerken Redux ile bağlantısı kopan bir parça düzeltildi
- Soru ayarlarında sayı aralığı "10" iken +10 yapıldığında sayı aralığının "1010" olması düzeltildi.
- Soru ayarlarında sayı aralığı +10 -10 iken, 100 üstü sayı girildiğinde otomatik +100 -100 olacak kod yazıldı ancak bozuk

> 01/06/2021 - Commit 33

- Bütün uygulama artık React Hooks kullanır hale getirildi
- Uygulamaya dil eklendi: İngilizce // Baştan aşağı tüm yazılar çevrildi
- Soru ekranında artık sorunun içeriği düzgün gösteriliyor
- Soru ayarlarında sayı arttırma/azaltma kısmındaki hata giderildi, artık genişliği 160pixel olacak

> 31/05/2021 - Commit 32

- Performans iyileştirmeleri
- Ayarlar kısmına abonelik sayfası ve uid eklendi
- Ayarlarda uid üstüne dokununca artık kopyalanıyor

> 30/05/2021 - Commit 31

- Sorularda sorulan rastgele sayıların maksimum aralığı artık soru ayarlarında ayarlanabiliyor
- Soru ayarlarındaki siyah barlar kaldırıldı

> 27/05/2021 - Commit 30

- İşlemlerin artık seçilip seçilmediği anlaşılabiliyor (hiç biri seçili değilse uyarı veriliyor, en az 1'inin seçilmesi için)
- Çıkarma işleminde sonucun negatif gelmesi düzeltildi
- Soru ayarlarında soru sayısı ve seçenek sayısı ayarlanırken artık max ve min kontrolü yapılıyor

> 27/05/2021 - Commit 29

- Sorulara 4 işlem seçme getirildi (toplama, çıkarma, çarpma, bölme)
- 1'den fazla işlem seçildiyse sorulara işlemler rastgele geliyor (toplama, çıkarma, çarpma, bölme)

> 25/05/2021 - Commit 28

- Soru çözüm butonları daha güzel hale getirildi
- Soru ayarlarında artık seçenek sayısı ayarlanabiliyor
- Soru ayarlarında artık soru sayısı ayarlanabiliyor
- Soru sonuçları sayfasında artık sonuçlar gösteriliyor
- Soru sonuçlarında yanlış yapılan soruların doğru cevapları ve verilen cevaplar gösteriliyor
- Soru çözerken yukarıdaki barlar artık önceki sorunun doğru yada yanlış yapılıp yapılmadığını gösteriyor

> 25/05/2021 - Commit 27

- Reducer daha temiz hale getirildi
- Soru çözülürken geri gelinirse ve onay verilirse soru çözümü sıfırlanıyor
- Artık sorunun doğru yada yanlış yapıldığı reducer'a geliyor
- Soruların sonuçları ana sayfaya dönünce resetleniyor

> 25/05/2021 - Commit 26

- Rastgele soru üretiminde bazı seçeneklerin aynı gelmesi düzeltildi
- Rastgele soru üretiminde seçeneklerde sorunun cevabıyla aynı seçeneklerin gelmesi düzeltildi

- Changelog eklendi
