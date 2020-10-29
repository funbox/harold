# @funboxteam/harold

**harold** — CLI-утилита для создания «слепков» состояния файлов сборки проекта и сравнения ранее созданных «слепков».

В результате сравнения выводится отчёт, который содержит:

1. Разницу во времени сборки проекта.
2. Разницу в размере и количестве файлов по категориям (JS, CSS, Images и т. д.).
3. Общую разницу в размере и количестве всех файлов.
4. Пофайловое сравнение с информацией об удалённых, добавленных и изменённых файлах.

Размеры выводятся в виде обычного размера + размера в gzip, например: `758 kB (219 kB)`.

## Установка

```bash
npm i -g @funboxteam/harold
```

## Доступные команды

### snapshot \[options\]

Собирает проект, и создаёт слепок сборки.

Доступные флаги:

- `-e, --exec <cmd>` — указывает команду для сборки проекта, по умолчанию `NO_HASH=true npm run build-production`;
- `-p, --path <path>` — указывает путь до директории, в которую будет собран проект, по умолчанию `public`.

### diff \<left\> \<right\>

Сравнивает предоставленные слепки.

### help

Предоставляет справку по командам.

## Примеры использования

```bash
# Переходим в директорию проекта
cd ~/my-syper-kewl-project/

# Делаем снэпшот
harold snapshot

# Сравниваем снэпшоты
harold diff harold_snapshot_20201029_101422.json harold_snapshot_20201029_105839.json
```

## Пример результата сравнения

Сравнение проекта до обновления зависимостей и после:

```
Snapshots:
 Left: 10/21/2020 2:09:00 AM • my-syper-kewl-project • develop
 Right: 10/21/2020 2:04:32 AM • my-syper-kewl-project • improvement-XX-1234-checklist

Build time:
 23 seconds faster (Left: 96 seconds, Right: 73 seconds)

Diff by category:
 ————————————————————————————————————————————————————————————————————————————————————————————————————— 
                build_snapshot_20201020_210900   build_snapshot_20201020_210432   Changes              
 ————————————————————————————————————————————————————————————————————————————————————————————————————— 
  JS            1.04 MB (268 kB)                 1.04 MB (270 kB)                 +7.45 kB (+2.56 kB)  
 ————————————————————————————————————————————————————————————————————————————————————————————————————— 
  JS (legacy)   1.06 MB (283 kB)                 1.07 MB (285 kB)                 +7.44 kB (+2.4 kB)   
 ————————————————————————————————————————————————————————————————————————————————————————————————————— 
  CSS           144 kB (23.5 kB)                 144 kB (23.5 kB)                 -34 B (-6 B)         
 ————————————————————————————————————————————————————————————————————————————————————————————————————— 
  Images        5.26 MB (5.23 MB)                5.26 MB (5.23 MB)                No changes           
 ————————————————————————————————————————————————————————————————————————————————————————————————————— 
  Fonts         126 kB (126 kB)                  159 kB (159 kB)                  +33.9 kB (+33.9 kB)  
 ————————————————————————————————————————————————————————————————————————————————————————————————————— 
  Videos        1.59 MB (1.58 MB)                1.59 MB (1.58 MB)                No changes           
 ————————————————————————————————————————————————————————————————————————————————————————————————————— 
  Other         251 kB (105 kB)                  252 kB (105 kB)                  +1.36 kB (+38 B)     
 ————————————————————————————————————————————————————————————————————————————————————————————————————— 
                                                                                                       
  Total         9.47 MB (7.61 MB)                9.52 MB (7.65 MB)                +50.1 kB (+38.9 kB)  
 ————————————————————————————————————————————————————————————————————————————————————————————————————— 

Diff by files:
 m public/frontend-static: +16.2 kB (+5 kB)
 m public/frontend-static/app.js: +9 B (+8 B)
 m public/frontend-static/fonts: +33.9 kB (+33.9 kB)
 + public/frontend-static/fonts/16397e8e7c285208558b33bb22f3a014.woff2: 17.9 kB (17.9 kB)
 - public/frontend-static/fonts/18fb1fbcc2fd291a01dd331c4a647ec2.woff2: 14.1 kB (14.1 kB)
 - public/frontend-static/fonts/192eac754bfd943c3a3a5a58172ad581.woff: 18.1 kB (18 kB)
 + public/frontend-static/fonts/373e6790b35fa25f92841b3525065030.woff: 22.7 kB (22.6 kB)
 - public/frontend-static/fonts/3b494ebf56d9f2c0614aa7843897bead.woff: 18.3 kB (18.3 kB)
 + public/frontend-static/fonts/46eb50820961d6c6ea3b4ecfd6020711.woff: 20.6 kB (20.5 kB)
 - public/frontend-static/fonts/62f87604652612ce9efb4b6d12d6f13c.woff2: 12.7 kB (12.7 kB)
 + public/frontend-static/fonts/82d03c3066ded8ace18650e6905eb076.woff: 22.9 kB (22.9 kB)
 - public/frontend-static/fonts/8f7c0ec50bd4def720e2213da7863c33.woff2: 14 kB (14 kB)
 + public/frontend-static/fonts/abe08f36780fd2ff9c8f5d2a40c345dc.woff: 22.8 kB (22.8 kB)
 + public/frontend-static/fonts/b61ed434bd8c40e637df087348725fc3.woff2: 18.2 kB (18.2 kB)
 + public/frontend-static/fonts/c2647e359b902afd1e2a73c8200b4fc5.woff2: 18.2 kB (18.2 kB)
 - public/frontend-static/fonts/d66a9e5d5af32f5a3f15b8d5c74d3978.woff: 16.5 kB (16.5 kB)
 + public/frontend-static/fonts/f6e1490dfbd11968c1eef39ce76e66f8.woff2: 16.3 kB (16.3 kB)
 - public/frontend-static/fonts/f83f4a7ddd56c9ec00adbf816096f74e.woff: 18.1 kB (18 kB)
 - public/frontend-static/fonts/fea0b4f5285dcae3530fece1e04038bf.woff2: 13.9 kB (13.9 kB)
 m public/frontend-static/legacy.9.js: -1 B (+2 B)
 m public/frontend-static/legacy.app.js: +11 B (+4 B)
 m public/frontend-static/legacy.vendor.js: +7.43 kB (+2.39 kB)
 m public/frontend-static/styles.css: -34 B (-6 B)
 m public/frontend-static/styles.js: +2 B (+10 B)
 m public/frontend-static/ThirdPartyNotice.txt: +1.36 kB (+38 B)
 m public/frontend-static/vendor.js: +7.44 kB (+2.55 kB)
```
