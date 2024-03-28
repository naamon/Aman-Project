/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package exercise2;

/**
 *
 * @author Naama
 */
import java.util.Scanner;
import java.lang.Math;
public class Exercise2 {


    /**
     * @param args the command line arguments
     */
    
    static void PrintRec(int height, int width){
        
        int OddNumber = ((width+1)/2)-2;
        //case 1
        if((height-2)%OddNumber==0 ){
            int space = OddNumber;
            System.out.println("odd number: "+OddNumber);
            int AstPrint = 3, numOfLine=(height-2)/OddNumber;
            //print the first line
            for (int k = 0; k < space+1; k++) {
                System.out.print(" ");
            }
            System.out.println("*");
            
            
            //print of *
            for (int i = 1; i < height; i++) {
                
                //print space
                for (int k = 0; k < space; k++) {
                    System.out.print(" ");
                }
                for(int j=0;j<AstPrint;j++){
                    System.out.print("*");
                }
                if(i%numOfLine==0){
                    AstPrint+=2;
                    space--;
                }
                //end line of *
                System.out.println("");
            }            
        }
        //case 2
        else{
            int AstPrint = 3, numOfLine=(height-2)/OddNumber, FirstNumOfLine = numOfLine+((height-2)%OddNumber), space = OddNumber;
            System.out.println("numOfLine: "+numOfLine+" FirstNumOfLine: "+FirstNumOfLine);
            
            //print the first line and space
            for (int k = 0; k < space+1; k++) {
                System.out.print(" ");
            }
            System.out.println("*");
            for (int i = 1; i < height-1; i++) {
                //print space
                for (int k = 0; k < space; k++) {
                    System.out.print(" ");
                }
                
                for(int j=0;j<AstPrint;j++){
                    System.out.print("*");
                }
                
                if(i==FirstNumOfLine||i>FirstNumOfLine&&i%numOfLine==0){
                    AstPrint+=2;
                    space--;
                }
                System.out.println("");
            }
        }
    }
    
    public static void rectangle (int height, int width){
        
        if(height==width||Math.abs(width-height)>5){
            System.out.println("The area of the rectangle is: "+height*width);
        }
        else{
            System.out.println("The perimeter of the rectangle is: "+(height+width)*2);
        }


    }
    
    public static void triangular (int height, int width){
        Scanner in = new Scanner(System.in);
        int inputNumber;
        double leg;
        System.out.println("enter 1 to triangle perimeter and 2 for print triangle ");
        inputNumber = in.nextInt();
        
        switch(inputNumber){
            case 1:
                leg = Math.sqrt(Math.pow(height, 2)+Math.pow(width, 2));
                System.out.println("The perimeter of the triangle is: "+(leg*2)+width);
                break;
            case 2:
                if(width%2==0 || width>height*2){
                    System.out.println("no option to print the triangle ");
                }
                else{
                    PrintRec(height, width);
                }
                break;
        }

    }

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);

        boolean flagExit = true;
        int inputNumber;
        int height,width;

        while(flagExit){
            System.out.println("enter 1 for rectangle 2 for triangular and 3 to exit");
            inputNumber = in.nextInt();
            
            switch(inputNumber){
                case 1:
                    System.out.println("enter height: ");
                    height = in.nextInt();
                    System.out.println("enter width: ");
                    width = in.nextInt();
                    rectangle(height,width);
                    break;                
                case 2:
                    System.out.println("enter height: ");
                    height = in.nextInt();
                    System.out.println("enter width: ");
                    width = in.nextInt();
                    triangular(height,width);
                    break;
                case 3:
                    flagExit = false;
                    break;
            }
            
        }

    }
    
}
