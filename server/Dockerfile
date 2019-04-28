FROM node:10 as builder

ARG version=latest

WORKDIR /server
ADD . .

RUN yarn --cache-folder ./ycache && rm -rf ./ycache
RUN yarn --pure-lockfile && \
    yarn run build && \
    yarn cache clean

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

# Sourcekit-LSP Executable
COPY --from=lsp-builder /usr/bin/sourcekit-lsp /usr/bin/
ENV PATH=/usr/bin/sourcekit-lsp:$PATH

COPY --from=builder /lib /lib

EXPOSE 3000

ENTRYPOINT node lib/server.js