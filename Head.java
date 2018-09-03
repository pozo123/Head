/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package head;
import java.util.*;
/**
 *
 * @author DPOZOB
 */


public class Head {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
        String[][] tabla = new String[15][15];//tabla[inge][proy]
        Scanner in = new Scanner(System.in);
        int var;
        int ni = 0; //numero de ingenieros
        int np = 0; //numero de proyectos
        int i;
        int j;
        boolean flag = true;
        
        //Poner acceso, si el que entra es admin se puede ingresar inges y proyectyos, si es inge es horas
        //pedir no solo nombre sino todo y construir la instancia
        
        tabla[0][0] = " ";
        
        while(flag){
        System.out.println("1.- Ingresar Ingeniero"+"\n"+"2.- Ingresar Proyecto"+"\n"+"3.- Ingresar horas"+"\n"+"4.- Cerrar");
        var = in.nextInt();
        if(var == 1){
           System.out.println("Ingresa nombre");
           ni++;
           tabla[ni][0] = in.next();
        }
        else if(var == 2){
           System.out.println("Ingresa nombre");
           np++;
           tabla[0][np] = in.next();
        }
        else if(var == 3){
            System.out.println("que inge");
        }
        else if(var == 4)
            flag = false;
        
        
        for(i=0;i<Math.max(ni+1,1);i++){
            for(j=0;j<Math.max(np+1,1);j++){
                if(tabla[i][j]==null)
                    System.out.print("0 ");
                else
                    System.out.print(tabla[i][j]+" ");
            }
            System.out.println("\n");
        }
        
        }
    }
        
    
}
