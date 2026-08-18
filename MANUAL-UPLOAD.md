# Manual GitHub Upload Guide

## Method 1: Using GitHub CLI (Recommended)

### 1. Install GitHub CLI
Visit https://cli.github.com/ to download and install

### 2. Login to GitHub
```bash
gh auth login
```

### 3. Run Upload Script
```bash
cd "C:\Users\Administrator\.dsh\profiles\web-desktop\node_modules\dsh-afdian"
powershell -ExecutionPolicy Bypass -File upload-to-github.ps1
```

## Method 2: Manual Upload

### 1. Create Repository
1. Visit https://github.com/new
2. Repository name: `dsh-afdian`
3. Description: `爱发电 (Afdian) data plugin for DeepSeek Harness`
4. Select **Public**
5. Click "Create repository"

### 2. Upload Files
1. Click "uploading an existing file" on GitHub page
2. Select files from plugin directory:
   - src/index.js
   - lib/api.js
   - lib/client.js
   - lib/config.js
   - settings.html
   - cordis.patch.yml
   - package.json
   - README.md
   - CHANGELOG.md
   - LICENSE
   - .gitignore
   - PUBLISHING.md

### 3. Commit Changes
Click "Commit changes"

## Method 3: Using ZIP File

1. Download distribution package: `dsh-afdian-v0.1.0.zip`
2. On GitHub repo page click "Add file" → "Upload files"
3. Upload ZIP file
4. Release as new version in Releases section

## Add GitHub Topics

1. Go to Repository → **Settings** → **Topics**
2. Add topics:
   - `deepseek-harness`
   - `dsh-plugin`
   - `afdian`
   - `爱发电`
   - `plugin`
3. Click "Save changes"

## Next Steps

### Publish to npm (Optional)
```bash
npm login
npm publish
```

### Add GitHub Actions (Optional)
Create `.github/workflows/publish.yml` for automated publishing.
