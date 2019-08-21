FROM jjanzic/docker-python3-opencv

RUN git clone --recurse-submodules https://github.com/duckietown/apriltags3-py.git
RUN ls
WORKDIR /apriltags3-py
RUN git submodule init
RUN git submodule update
WORKDIR /apriltags3-py/apriltags
RUN cmake .
RUN make
WORKDIR /apriltags3-py

RUN apt update -y
RUN apt install net-tools -y

RUN pip install pyzmq

EXPOSE 5600
