module Main exposing (..)

import Browser
import Html exposing (Html, button, div, text)
import Html.Events exposing (onClick)
import Platform.Sub exposing (Sub)
import Random exposing (Generator, int, initialSeed, step, Seed)
import List exposing (head, drop)

-- 模型
type alias Model =
    { randomNum : Int
    , wordList : List String
    , selectedWord : Maybe String
    }

init : Model
init =
    { randomNum = 0
    , wordList = ["word1", "word2", "word3", "word999"] -- 请替换为你的单词列表
    , selectedWord = Nothing
    }

-- 消息类型
type Msg
    = GenerateRandomNum
    | SelectRandomWord

-- 更新函数
update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of
        GenerateRandomNum ->
            let
                (newRandomNum, _) =
                    getRandomNumber model.randomNum
            in
            ({ model | randomNum = newRandomNum, selectedWord = Nothing }, Cmd.none)

        SelectRandomWord ->
            let
                selectedWord =
                    getRandomWord model.randomNum model.wordList
            in
            ({ model | selectedWord = selectedWord }, Cmd.none)

-- 生成一个0到999之间的随机数
getRandomNumber : Int -> (Int, Seed)
getRandomNumber seed =
    Random.step (Random.int 0 999) (initialSeed seed)

-- 获取随机数对应的单词
getRandomWord : Int -> List String -> Maybe String
getRandomWord randomNum wordList =
    List.head (List.drop randomNum wordList)

-- 视图函数
view : Model -> Html Msg
view model =
    div []
        [ button [ onClick GenerateRandomNum ] [ text "生成随机数" ]
        , button [ onClick SelectRandomWord ] [ text "选择单词" ]
        , div [] [ text ("随机数: " ++ String.fromInt model.randomNum) ]
        , div [] [ text ("选择的单词: " ++ Maybe.withDefault "" model.selectedWord) ]
        ]

-- 订阅函数
subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none

-- Elm 程序的主入口
main : Program () Model Msg
main =
    Browser.element
        { init = \_ -> (init, Cmd.none)
        , update = update
        , view = view
        , subscriptions = subscriptions
        }