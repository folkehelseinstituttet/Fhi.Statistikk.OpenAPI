# Brukerveiledning �pent API for FHI Statistikk

## Beskrivelse/Innledning
Skal vi kort beskrive alle endepunkter eller kun de som trengs for � hente data?

## Swagger
[Se Swagger dokumentasjon](link)

## Flyt for � hente data
(Hvilke metoder trengs)
### Hent kilder
Endepunktet `/api/open/v1/Common/source` kan brukes for � liste opp ulike kilder. 

Id i responson fra dette endepunktet brukes som SourceId i alle andre endepunkter i API'et.
### Hent tabeller
Endepunktet `/api/open/v1/{SourceId}/table` kan brukes for � liste opp de ulike tabellene for en kilde. Det er ogs� mulig � legge inn et filter modifiedAfter for � liste opp de 
tabellene som er oppdatert etter en gitt tid.

TableId i responsen fra dette endepunktet brukes sammen med SourceId i de andre endepunktene i API'et.
### Hent sp�rring
Endepunktet `/api/open/v1/{SourceId}/Table/{TableId}/query` kan brukes for � hente ut en sp�rring for � hente ut data. Responsen fra dette endepunktet kan kopieres og brukes som
request body i endepunktet for � hente data. 
### Hent data
Endepunktet `/api/open/v1/{SourceId}/Table/{TableId}/data` kan brukes for � hente selve dataene for en tabell. 
#### Filter
##### Item
##### Top
##### All
#### Respons formater
##### json-stat2
Returnerer json objekt[Beskrivelse av JSON-stat standarden](https://json-stat.org/format/)
Responsen fra sp�rringer i dette formatet kan limes inn i [JSON-stat explorer](http://jsonstat.com/explorer/) for � se p� dataene i et lesevennlig format.
##### csv2
Returnerer csv-fil med lesbare etiketter for dimensjoner og m�ltall.
##### csv3
Returnerer csv-fil med koder for dimensjoner og m�ltall.


## Metadata
Skal vi ta med dette?
## Spesialtegn/Flagging
Skal vi ta med dette?

## Feilmeldinger
