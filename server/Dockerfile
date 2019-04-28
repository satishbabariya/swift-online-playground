FROM satishbabariya/swift as lsp-builder

RUN apt-get -q update && \
    apt-get -q install -y \
    sqlite3 \
    libsqlite3-dev \
    libblocksruntime-dev

# Download and Build Sourcekit-LSP
RUN git clone --depth 1 https://github.com/apple/sourcekit-lsp
WORKDIR /sourcekit-lsp
RUN swift build -Xcxx -I/usr/lib/swift && mv `swift build --show-bin-path`/sourcekit-lsp /usr/bin/
RUN chmod -R o+r /usr/bin/sourcekit-lsp


FROM satishbabariya/swift

# Print Installed Swift Version
RUN swift --version

# Set absolute path to the swift toolchain
ENV SOURCEKIT_TOOLCHAIN_PATH=/usr/lib/swift
ENV SOURCEKIT_LOGGING=3

ENV DEBIAN_FRONTEND noninteractive

ARG NODE_VERSION=10
ENV NODE_VERSION $NODE_VERSION

RUN apt-get update
RUN apt-get -qq update
RUN apt-get install -y build-essential
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_$NODE_VERSION.x | bash
RUN apt-get install -y nodejs
RUN node --version

# Sourcekit-LSP Executable
COPY --from=lsp-builder /usr/bin/sourcekit-lsp /usr/bin/
ENV PATH=/usr/bin/sourcekit-lsp:$PATH

COPY . .

RUN npm install
RUN npm run build

EXPOSE 3000

ENTRYPOINT node lib/server.js