# GTM Container Audit Tool

GTMコンテナのエクスポートJSONを解析して、不要なリソースを一覧化するWebツールです。

🔗 **https://azuwatsan.github.io/gtm-tag-allcheck/**

---

## こんなときに使う

- GTMコンテナを久しぶりに棚卸ししたい
- 代理店から引き継いだコンテナを整理したい
- リニューアル前にタグの状態を把握したい
- 「このトリガー、まだ使ってる？」を一気に確認したい

---

## できること

| 機能 | 内容 |
|---|---|
| 未使用トリガー検出 | どのタグからも参照されていないトリガーを一覧化 |
| 未使用変数検出 | タグ・トリガー・他の変数から参照されていない変数を一覧化 |
| 停止中タグ検出 | `paused: true` のタグを一覧化 |
| CSV出力 | Excel で開ける UTF-8 BOM付きCSV |
| JSON出力 | 監査結果をJSONで保存 |

---

## 使い方

### 1. GTMからJSONをエクスポート

GTM管理画面 → 管理 → コンテナをエクスポート → 「現在のワークスペース」または「バージョン」を選択 → JSONファイルをダウンロード

### 2. ツールにアップロード

[ツールを開く](https://azuwatsan.github.io/gtm-tag-allcheck/) → JSONファイルをドラッグ&ドロップ（またはクリックして選択）

### 3. Run Audit

「Run Audit」ボタンをクリック → 解析結果が表示される

### 4. 結果を確認・出力

- フィルタで種別を絞り込む（未使用トリガー／未使用変数／停止中タグ）
- 名前で検索する
- 「CSV出力」または「JSON出力」でダウンロード

---

## プライバシー

アップロードしたJSONはブラウザ内でのみ処理されます。外部サーバーへの送信は一切行いません。

---

## ローカルで動かす

```bash
git clone https://github.com/AzuWatsan/gtm-tag-allcheck.git
cd gtm-tag-allcheck
npm install
npm run dev
```

## テスト

```bash
npm test
```

---

## 技術スタック

React / TypeScript / Vite / Tailwind CSS / Vitest
