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
        String[][] tabla = new String[15][15];
        ArrayList<Ingeniero> inges = new ArrayList<Ingeniero>();
        ArrayList<Proyecto> proyectos = new ArrayList<Proyecto>();
        Scanner in = new Scanner(System.in);
        int var;
        int ni = 0; //numero de ingenieros
        int np = 0; //numero de proyectos
        int i;
        int j;
        boolean flag1 = true;
        boolean flag2 = true;
        String st;
        
        
        //Llenar tabla de horas
        
        
        tabla[0][0] = " ";
        while(flag1){
            System.out.println("1.- Admin"+"\n"+"2.- Inge"+"\n"+"3.- Imprimir"+"\n"+"4.- Salir"+"\n");
            var = in.nextInt();
            if(var == 1){
                while(flag2){
                    System.out.println("1.- Ingresar Ingeniero"+"\n"+"2.- Ingresar Proyecto"+"\n"+"3.- Cerrar"+"\n");
                    var = in.nextInt();
                    //Construye Inge y lo agrega
                    if(var == 1){
                       System.out.println("Ingresa datos: Nombre Username Password (separado por espacios).");
                       inges.add(new Ingeniero(in.next(),in.next(),in.next()));
                       ni++;
                    }
                    //Construye proyecto y lo agrega
                    else if(var == 2){
                       ArrayList<String> req = new ArrayList<String>();
                       System.out.println("Ingresa requisitos (done para terminar)");
                       st = in.nextLine();
                       while(!st.equals("done")){
                           req.add(st);
                           st = in.nextLine();
                       }
                       System.out.println("Ingresa Nombre lider");
                       int il = -1;
                       st = in.nextLine();
                       for(i=0;i<inges.size();i++){
                           if(inges.get(i).getNombre() == st)
                               il = i;
                       }
                       if(il == -1)
                           System.out.println("No existe ese inge");
                       else{
                           System.out.println("Ingresa nombre proyecto");
                           proyectos.add(new Proyecto(in.nextLine(), req, inges.get(il)));
                           np++;
                       }
                    }
                    else if(var == 3)
                        flag2 = false;
                }
            }
            else if(var == 2){
                while(flag2){
                    System.out.println("Username: ");
                    st = in.nextLine();
                    int u = -1;
                    for(i=0;i<inges.size();i++){
                        if(inges.get(i).getUsername() == st)
                            u = i;
                        }
                    if(u != -1){
                        System.out.println("Password: ");
                        st = in.nextLine();
                        if(st == inges.get(u).getPassword()){
                            //Funcionalidad inge
                        }
                        else{
                            System.out.println("Password incorrecto.");
                        }
                    }
                    else{
                        System.out.println("Username incorrecto");
                           flag2 = false;
                    }
                }
      
            }
            else if(var ==3)
                for(final Object[] row : tabla){
                    System.out.format("%-15s%-15s%15-s\n", row);
                }
            else if(var == 4) {
                flag1 = false;
            }
            flag2 = true;
        }
             
        
    }
        
    
}
