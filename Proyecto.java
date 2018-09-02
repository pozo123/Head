/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package head;

import java.util.ArrayList;
import java.util.Date;
/**
 *
 * @author franciscopozodelatijera
 */
public class Proyecto {
    private ArrayList<String> lista_requisitos; //Lista de requisitos que habrá que llenar para activar el proyecto
    private ArrayList<Boolean> estatus_requisitos; //Lista de estatus de requisitos, true si el requisito se ha cumplido
    private int estado; //1-> Activo 2-> No activo 3-> Terminado
    private Ingeniero lider;
    private double horas;
    private long fecha_inicio; //long porque se va a manejar con java.util.date getTime()
    private long fecha_activacion; 
    private long fecha_fin;//long porque se va a manejar con java.util.date getTime()
    private Ingeniero[] asignados;
    private Date date;

    public Proyecto() {
        this.estado = 2;
        this.horas= 0;
        this.fecha_inicio = date.getTime();
//        for(int i=0; i < lista_requisitos.size(); i++){
//            this.estatus_requisitos.add(false);
//        }
    }

    public Proyecto(ArrayList<String> requisitos, Ingeniero lider) {
        this.lista_requisitos = requisitos;
        this.lider = lider;
        this.estado = 2;
        this.horas= 0;
        this.fecha_inicio = date.getTime();
        for(int i=0; i < lista_requisitos.size(); i++){
            this.estatus_requisitos.add(false);
        }
    }
    
    public Proyecto(ArrayList<String> requisitos, Ingeniero lider, Ingeniero[] asignados) {
        this.lista_requisitos = requisitos;
        this.lider = lider;
        this.asignados = asignados;
        this.estado = 2;
        this.horas= 0;
        this.fecha_inicio = date.getTime();
        for(int i=0; i < lista_requisitos.size(); i++){
            this.estatus_requisitos.add(false);
        }
    }

    public ArrayList<String> getLista_requisitos() {
        return lista_requisitos;
    }

    public ArrayList<Boolean> getEstatus_requisitos() {
        return estatus_requisitos;
    }

    public int getEstado() {
        return estado;
    }

    public Ingeniero getLider() {
        return lider;
    }

    public double getHoras() {
        return horas;
    }

    public long getFecha_inicio() {
        return fecha_inicio;
    }

    public long getFecha_activacion() {
        return fecha_activacion;
    }
    
    public long getFecha_fin() {
        return fecha_fin;
    }

    public Ingeniero[] getAsignados() {
        return asignados;
    }

    //Al cambiar este tambien hay que cambiar la lista de estatus_requisitos
    public void setLista_requisitos(ArrayList<String> lista_requisitos) {
        this.lista_requisitos = lista_requisitos;
    }

    public void setEstatus_requisitos(ArrayList<Boolean> estatus_requisitos) {
        this.estatus_requisitos = estatus_requisitos;
    }

    public void setEstado(int estado) {
        this.estado = estado;
    }

    public void setLider(Ingeniero lider) {
        this.lider = lider;
    }

    public void setHoras(double horas) {
        this.horas = horas;
    }

    public void setFecha_inicio(long fecha_inicio) {
        this.fecha_inicio = fecha_inicio;
    }

    public void setFecha_activacion(long fecha_activacion) {
        this.fecha_activacion = fecha_activacion;
    }
    
    public void setFecha_fin(long fecha_fin) {
        this.fecha_fin = fecha_fin;
    }

    public void setAsignados(Ingeniero[] asignados) {
        this.asignados = asignados;
    }
    
    //Revisa la lista de estatus_requisitos y actualiza el estado. Activo si todos se cumplen, no activo de otra manera.
    public int updateEstado(){
        boolean visto_bueno = true;
        int i = 0;
        while(visto_bueno && i < estatus_requisitos.size()){
            if(!estatus_requisitos.get(i))
                visto_bueno = false;
            else
                i++;
        }
        if(visto_bueno){
            estado = 1;//activo
            fecha_activacion = date.getTime();
        }
        else
            estado = 2;//No activo
        return estado;
    }
    
    public void addHoras(double horas_nuevas){
        horas = horas + horas_nuevas;
    }
    
    public void finish(){
        fecha_fin = date.getTime();
        estado = 3;
    }
    
    public boolean recibo_requisito(String req){
        boolean found = false;
        int i = 0;
        while(!found && i < lista_requisitos.size()){
            if(req.equals(lista_requisitos.get(i)))
                found = true;
            else
                i++;
        }
        if(!found)
            return false; //error, no lo encontró
        else{
            estatus_requisitos.set(i, true);
            updateEstado();
            return true;
        }
    }
    
}
