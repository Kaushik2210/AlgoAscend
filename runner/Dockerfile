FROM debian:bookworm-slim@sha256:e67eeead736ff7bbe258ef088bff683635c561b1fcfefad0806c1df4ab49ce0e

RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc libc6-dev python3 openjdk-17-jdk-headless \
    && rm -rf /var/lib/apt/lists/*

COPY execute.py /opt/algoascend/execute.py
WORKDIR /work
USER 65534:65534
ENTRYPOINT ["/usr/bin/python3", "-I", "/opt/algoascend/execute.py"]
