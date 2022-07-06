FROM alpine:latest as stage1

WORKDIR /src
COPY ./src /src

EXPOSE 22

RUN apk update
RUN apk add openssh
RUN rc-update add sshd 
RUN service sshd start
RUN service sshd status
