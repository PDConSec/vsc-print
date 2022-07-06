FROM alpine:latest
WORKDIR /src
COPY ./src /src
RUN apk update
RUN apk add bash
RUN apk add openssh
RUN apk add openrc
RUN rc-update add sshd 
RUN echo -n 'PasswordAuthentication yes' >> /etc/ssh/sshd_config
RUN ssh-keygen -t rsa -C "testuser@localhost" -f /etc/ssh/testuser_rsa_key -N wibble
RUN chmod a+r /etc/ssh/testuser_rsa_key
RUN adduser -g "" -D testuser
RUN echo testuser:testpassword | chpasswd
COPY ./entrypoint.sh /
RUN chmod +x -v /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
EXPOSE 22
