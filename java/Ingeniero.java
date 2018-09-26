/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package head;

/**
 *
 * @author franciscopozodelatijera
 */
public class Ingeniero {
    private String nombre;
    private String username;
    private String password;
    private int especialidad; // 1-> Plomería 2-> Electricidad 3-> Ambos
    private Proyecto proyecto_asignado;
    private int jerarquia; // 1-> Admin 2-> Lider de grupo 3-> Estandar
    private double horas;
    
    public Ingeniero(){
        this.horas = 0;
    }
    
    public Ingeniero(String nombre, String username, String password){
        this.nombre = nombre;
        this.username = username;
        this.password = password;
        this.horas = 0;
    }
    
    public Ingeniero(String nombre, String username, String password, int especialidad, Proyecto proyecto_asignado, int jerarquia){
        this.nombre = nombre;
        this.username = username;
        this.password = password;
        this.especialidad = especialidad;
        this.proyecto_asignado = proyecto_asignado;
        this.jerarquia = jerarquia;
        this.horas = 0;
    }

    public String getNombre() {
        return nombre;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public int getEspecialidad() {
        return especialidad;
    }

    public Proyecto getProyecto_asignado() {
        return proyecto_asignado;
    }

    public int getJerarquia() {
        return jerarquia;
    }
    
    public double getHoras() {
        return horas;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setEspecialidad(int especialidad) {
        this.especialidad = especialidad;
    }

    public void setProyecto_asignado(Proyecto proyecto_asignado) {
        this.proyecto_asignado = proyecto_asignado;
    }

    public void setJerarquia(int jerarquia) {
        this.jerarquia = jerarquia;
    }
    
    public void setHoras(double horas) {
        this.horas = horas;
    }
    
    public void addHoras(double horas_nuevas){
        horas = horas + horas_nuevas;
    }
    
    
}
