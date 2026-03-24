from datetime import datetime, timedelta
from app.models import db

config_dias = {
    0: ("08:00", "18:00", 30),  # Segunda
    1: ("08:00", "18:00", 30),  # Terça
    2: ("08:00", "18:00", 30),  # Quarta
    3: ("08:00", "18:00", 30),  # Quinta
    4: ("08:00", "18:00", 30),  # Sexta
    5: ("09:00", "13:00", 60),  # Sábado (Horário reduzido)
    6: None                     # Domingo (Fechado)
}


def gerar_grade_horarios(data_alvo):
    dia_semana = data_alvo.weekday()
    regra = config_dias.get(dia_semana)

    if not regra:
        return []
    str_inicio, str_fim, min_intervalo = regra

    atual = datetime.strptime(str_inicio, '%H:%M')
    fim = datetime.strptime(str_fim, '%H:%M')
    intervalo = timedelta(minutes=min_intervalo)

    grade = []
    while atual <= fim:
        grade.append(atual.strftime('%H:%M'))
        atual += intervalo

    return grade


"""
hoje = datetime.now()
horarios_hoje = gerar_grade_horarios(hoje)
print(f'Agenda para {hoje.strftime('%d/%m (%A)')}:')
print(horarios_hoje)
"""


def buscar_horarios_ocupados(barbeiro, data):
    consultar = 'SELECT data_hora, tempo_corte FROM agendamentos WHERE barbeiro = %s AND DATE(data_hora) = %s'
    resultado = db.obter_dados(consultar, (barbeiro, data,))
    return resultado


def horarios_livres(barbeiro, data):
    # lista de strings ['08:00', '08:30'...]
    todos = gerar_grade_horarios(data)
    ocupados = buscar_horarios_ocupados(
        barbeiro, data)   # lista de dicts do banco
    
    livres = todos.copy()  # copia a lista para não modificar o original

    for agendamento in ocupados:
        inicio = agendamento['data_hora']   # datetime
        # converte tempo_corte '01:00:00' para timedelta
        h, m, s = str(agendamento['tempo_corte']).split(':')
        duracao = timedelta(hours=int(h), minutes=int(m))
        fim = inicio + duracao

        for horario in todos:
            # Converte '09:00' para datetime para comparar
            horario_dt = datetime.strptime(horario, '%H:%M').replace(
                year=data.year, month=data.month, day=data.day)
            if horario_dt >= inicio and horario_dt < fim:
                if horario in livres:
                    livres.remove(horario)
    return livres
