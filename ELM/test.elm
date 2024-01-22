module Main exposing (..)

import Browser
import Html exposing (..)
import Html.Events exposing (onClick)
import Http
import Json.Decode exposing (..)
import Json.Decode.Pipeline exposing (required)
import Html.Attributes exposing (placeholder,style)
import Html.Events exposing (onInput)
import Random

type CouleurCarte = Pique 
                    | Coeur 
                    | Carreau 
                    | Trefle

type ValeurCarte = As
                    | Deux
                    | Trois
                    | Quatre
                    | Cinq
                    | Six
                    | Sept
                    | Huit
                    | Neuf
                    | Dix
                    | Valle
                    | Dame
                    | Roi

type alias Carte =
    { couleur : CouleurCarte
    , valeur : ValeurCarte
    }

asDeTrefle : Carte
asDeTrefle =
    { couleur = Trefle
    , valeur = As
    }

main : Program () Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = \_ -> Sub.none
        }
