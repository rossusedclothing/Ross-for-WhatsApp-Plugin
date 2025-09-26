package com.example;

import it.auties.whatsapp.api.PairingCodeHandler;
import it.auties.whatsapp.api.Whatsapp;

/**
 * Hello world!
 *
 */
public class App {
    public static void main(String[] args) {
//        设置系统代理
        System.out.println("Enter the phone number(include the country code prefix, but no +, spaces or parenthesis):");
        var phoneNumber = 8619005425734L;
        Whatsapp.webBuilder() // Use the Web api
                .newConnection() // Create a new connection
                .unregistered(phoneNumber, PairingCodeHandler.toTerminal()) // Print the pairing code to the terminal
                .addLoggedInListener(api -> System.out.printf("Connected: %s%n", api.store().privacySettings())) // Print a message when connected
                .addDisconnectedListener(reason -> System.out.printf("Disconnected: %s%n", reason)) // Print a message when disconnected
                .addNewChatMessageListener(message -> System.out.printf("New message: %s%n", message.toString())) // Print a message when a new chat message arrives
                .connect() // Connect to Whatsapp asynchronously
                .join() // Await the result
                .awaitDisconnection(); // Wait
    }


}
