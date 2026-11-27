#!/bin/sh
set -eu

exec /usr/bin/bwrap \
  --unshare-all --die-with-parent --new-session --uid 65534 --gid 65534 \
  --clearenv --setenv PATH /usr/bin:/bin --setenv LANG C.UTF-8 --setenv ALGO_VM_LIMITS 1 \
  --ro-bind /usr /usr \
  --symlink usr/bin /bin --symlink usr/lib /lib --symlink usr/lib64 /lib64 \
  --ro-bind /etc/alternatives /etc/alternatives \
  --ro-bind /etc/java-17-openjdk /etc/java-17-openjdk \
  --ro-bind /etc/ld.so.cache /etc/ld.so.cache \
  --ro-bind /opt/algoascend/execute.py /opt/algoascend/execute.py \
  --dev /dev --perms 1777 --size 16777216 --tmpfs /work --perms 1777 --size 16777216 --tmpfs /tmp \
  --remount-ro / --chdir /work \
  /usr/bin/prlimit --nproc=40:40 --nofile=128:128 --fsize=2097152:2097152 --core=0:0 -- \
  /usr/bin/python3 -I /opt/algoascend/execute.py
