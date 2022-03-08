import { Test, TestingModule } from "@nestjs/testing";
import { Socket } from "socket.io";
import { v4 } from "uuid";

import { DinoappGamesGateway } from "./dinoapp-games.gateway";

describe.skip("DinoappGamesGateway", () => {
  let gateway: DinoappGamesGateway;
  let socket: Socket;

  const returnPlayer = ({ room, vote = null, voteStatus = "" }) => {
    return {
      room: room,
      id: v4(),
      name: "test",
      character: 0,
      vote: vote,
      voteStatus: voteStatus,
    };
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DinoappGamesGateway],
    }).compile();

    gateway = module.get<DinoappGamesGateway>(DinoappGamesGateway);
  });

  it("should return error if user tries to join a non existing room", () => {
    expect(
      gateway.handleJoinRoom(socket, returnPlayer({ room: "nonExisting" }))
    ).toEqual({
      event: "alertToClient",
      data: "Room does not exist",
    });
  });

  it("should return error if user tries to join a non existing room", () => {
    expect(
      gateway.handleJoinRoom(socket, returnPlayer({ room: "if1Room" }))
    ).toEqual({
      event: "msgCurrentPlayerData",
      data: "Joined Room",
    });

    gateway.currentPlayers.if1Room = [];
  });

  it("should return current players array with new player", () => {
    const player = returnPlayer({ room: "if1Room" });

    gateway.handleJoinRoom(socket, player);

    expect(gateway.currentPlayers.if1Room).toContain(player);

    gateway.currentPlayers.if1Room = [];
  });

  it("should return THINKING vote status if vote is null", () => {
    const player = returnPlayer({ room: "if1Room" });

    gateway.handleJoinRoom(socket, player);

    expect(gateway.currentPlayers.if1Room[0].voteStatus).toEqual("THINKING");

    gateway.currentPlayers.if1Room = [];
  });

  it("should change and reflect the user vote change", () => {
    const player = returnPlayer({ room: "if1Room", vote: 0 });

    const updatedVote = {
      ...player,
      vote: 1,
    };

    gateway.handleJoinRoom(socket, player);

    const findPlayer = gateway.currentPlayers.if1Room.find(
      (player) => player.id === updatedVote.id
    );

    expect(findPlayer.vote).toEqual(0);

    gateway.changeVote(socket, updatedVote);

    expect(findPlayer.vote).toEqual(1);

    gateway.currentPlayers.if1Room = [];
  });

  it("should change and reflect the vote status change", () => {
    const player = returnPlayer({ room: "if1Room", vote: 0 });

    const updatedVote = {
      ...player,
      vote: 1,
    };

    gateway.handleJoinRoom(socket, player);

    const findPlayer = gateway.currentPlayers.if1Room.find(
      (player) => player.id === updatedVote.id
    );

    expect(findPlayer.vote).toEqual(0);

    gateway.changeVote(socket, updatedVote);

    expect(findPlayer.voteStatus).toEqual("SECRET");

    gateway.currentPlayers.if1Room = [];
  });

  it("should reveal all votes", () => {
    const player1 = returnPlayer({ room: "if1Room" });

    const player2 = returnPlayer({ room: "if1Room" });

    const player3 = returnPlayer({ room: "if1Room" });

    gateway.handleJoinRoom(socket, player1);

    gateway.handleJoinRoom(socket, player2);

    gateway.handleJoinRoom(socket, player3);

    const updatedVote = {
      ...player1,
      vote: 1,
    };

    const updatedVote2 = {
      ...player3,
      vote: 1,
    };

    const findPlayer = gateway.currentPlayers.if1Room.find(
      (player) => player.id === updatedVote.id
    );

    gateway.changeVote(socket, updatedVote);
    gateway.changeVote(socket, updatedVote2);

    gateway.revealVotes(socket, findPlayer);

    expect(gateway.currentPlayers.if1Room[0].voteStatus).toEqual("REVEALED");

    expect(gateway.currentPlayers.if1Room[2].voteStatus).toEqual("REVEALED");

    gateway.currentPlayers.if1Room = [];
  });

  it("should reset room round", () => {
    const player1 = returnPlayer({ room: "if1Room" });
    const player2 = returnPlayer({ room: "if1Room" });

    gateway.handleJoinRoom(socket, player1);
    gateway.handleJoinRoom(socket, player2);

    const updatedVote = {
      ...player1,
      vote: 1,
    };

    const updatedVote2 = {
      ...player1,
      vote: 1,
    };

    gateway.changeVote(socket, updatedVote);

    gateway.changeVote(socket, updatedVote2);

    gateway.resetVotes(socket, updatedVote);

    expect(gateway.currentPlayers.if1Room[0].voteStatus).toEqual("THINKING");
    expect(gateway.currentPlayers.if1Room[1].voteStatus).toEqual("THINKING");
  });

  it("should clear all the room players", () => {
    const player1 = returnPlayer({ room: "if1Room" });
    const player2 = returnPlayer({ room: "if1Room" });

    gateway.handleJoinRoom(socket, player1);
    gateway.handleJoinRoom(socket, player2);

    gateway.resetPlayers(socket, player1);

    expect(gateway.currentPlayers.if1Room).toEqual([]);
  });
});
