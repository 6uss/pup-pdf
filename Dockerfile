FROM ghcr.io/puppeteer/puppeteer:latest
USER root
# Set environment variables for Puppeteer to work properly
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
  NODE_ENV=production

# Install Bun
RUN apt-get update && \
  apt-get install -y curl unzip ca-certificates && \
  curl -fsSL https://bun.sh/install | bash && \
  ln -s /root/.bun/bin/bun /usr/local/bin/bun && \
  rm -rf /var/lib/apt/lists/*

# Optional: test Bun installation
RUN bun --version

COPY . .

RUN bun install

