create or replace procedure eliminarDepto(depto_id_in integer)
language plpgsql
as $$
begin
    update departamento
    set activo = false
    where departamento_id = depto_id_in;

    update municipio
    set activo = false
    where departamento_id = depto_id_in;
end;
$$;

create or replace procedure eliminarPais(pais_id_in integer)
language plpgsql
as $$
begin
    update pais
    set activo = false
    where pais_id = pais_id_in;

    update departamento
    set activo = false
    where pais_id = pais_id_in;

    update municipio m
    set m.activo = false
    from departamento d
    where m.departamento_id = d.departamento_id
      and d.id_pais = pais_id_in;
end;
$$;

CREATE OR REPLACE FUNCTION incrementar_contadores_departamento()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE pais
  SET total_departamentos = COALESCE(total_departamentos, 0) + 1
  WHERE id_pais = NEW.id_pais;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION reducir_contadores_departamento()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE pais
  SET total_departamentos = COALESCE(total_departamentos, 0) + 1
  WHERE id_pais = NEW.id_pais;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_incrementar_contadores
AFTER INSERT ON departamento
FOR EACH ROW
EXECUTE FUNCTION incrementar_contadores_departamento();

CREATE TRIGGER trg_reducir_contadores
AFTER DELETE ON departamento
FOR EACH ROW
EXECUTE FUNCTION reducir_contadores_departamento();
