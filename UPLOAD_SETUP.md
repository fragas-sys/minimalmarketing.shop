# Configuração do Sistema de Upload de Arquivos

Este projeto suporta upload otimizado de vídeos e arquivos para materiais de curso.

## Serviços Utilizados

### 1. Cloudinary (Vídeos)
**Por que?** Cloudinary oferece:
- Compressão automática de vídeos
- Streaming adaptativo (HLS)
- Thumbnails gerados automaticamente
- Otimização para mobile
- CDN global
- Transformações on-the-fly

### 2. Vercel Blob (Outros Arquivos)
**Por que?** Vercel Blob oferece:
- Integração nativa com Vercel
- Armazenamento rápido e seguro
- Ideal para PDFs, ZIPs, documentos
- Fácil configuração

## Como Configurar

### 1. Cloudinary

1. Crie uma conta gratuita em [cloudinary.com](https://cloudinary.com/)
2. No Dashboard, copie suas credenciais:
   - Cloud Name
   - API Key
   - API Secret
3. Adicione ao `.env.local`:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 2. Vercel Blob

1. No seu projeto Vercel, vá em **Storage** > **Create Database** > **Blob**
2. Copie o token de acesso
3. Adicione ao `.env.local`:

```env
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxx
```

## Funcionalidades

### Upload de Vídeos
- Formatos aceitos: MP4, WebM, MOV
- Tamanho máximo: 100MB
- Compressão automática
- Thumbnail gerado automaticamente
- Duração extraída automaticamente
- Streaming otimizado para mobile

### Upload de Arquivos
- Formatos aceitos: PDF, ZIP, DOC, DOCX, XLS, XLSX, PPT, PPTX
- Tamanho máximo: 50MB
- Armazenamento seguro

## Como Usar no Admin

1. Acesse `/admin/produto/[id]`
2. Crie ou edite um material
3. Escolha entre:
   - **URL Externa**: Cole o link de YouTube, Vimeo ou arquivo externo
   - **Upload**: Faça upload direto do seu computador

### Upload de Vídeo
1. Selecione "Upload de Vídeo"
2. Arraste e solte o arquivo ou clique para selecionar
3. Aguarde o upload (barra de progresso)
4. Thumbnail e duração são preenchidos automaticamente

### Upload de Arquivo
1. Selecione "Upload de Arquivo"
2. Arraste e solte o arquivo ou clique para selecionar
3. Aguarde o upload
4. URL e nome são preenchidos automaticamente

## Otimizações Mobile

### Vídeos
- Formato adaptativo (HLS/m3u8)
- Qualidade automática baseada na conexão
- Compressão otimizada
- Thumbnails de baixo peso

### Performance
- CDN global (Cloudinary)
- Cache agressivo
- Lazy loading
- Preload de thumbnails

## Limites e Custos

### Cloudinary Free Tier
- 25 GB armazenamento
- 25 GB bandwidth/mês
- 1000 transformações/mês

Suficiente para ~250 vídeos de 5 minutos (100MB cada)

### Vercel Blob Free Tier
- 1 GB armazenamento
- 100 GB bandwidth/mês

Suficiente para ~100 PDFs médios (10MB cada)

## Troubleshooting

### Erro: "Arquivo muito grande"
- Vídeos: máximo 100MB
- Arquivos: máximo 50MB
- Solução: Comprima o arquivo antes do upload

### Erro: "Upload falhou"
1. Verifique suas credenciais no `.env.local`
2. Verifique se o Cloudinary/Vercel Blob está configurado
3. Verifique o console do navegador para mais detalhes

### Vídeo não reproduz
1. Aguarde alguns minutos (processamento do Cloudinary)
2. Verifique se o formato é suportado
3. Tente fazer upload novamente

## Segurança

- Uploads requerem autenticação de admin
- Validação de tipo de arquivo no servidor
- Validação de tamanho no cliente e servidor
- URLs assinadas (Vercel Blob)
- Transformações seguras (Cloudinary)

## Próximos Passos

- [ ] Adicionar suporte para legendas
- [ ] Implementar preview antes do upload
- [ ] Adicionar progresso de processamento (Cloudinary webhook)
- [ ] Suporte para playlists
