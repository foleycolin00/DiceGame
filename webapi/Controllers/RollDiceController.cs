using Microsoft.AspNetCore.Mvc;
using System.Collections.Concurrent;
using System.Diagnostics;
using System.Linq;
using MathNet.Numerics.Random;

namespace webapi.Controllers;

[ApiController]
[Route("[controller]")]
public class RollDiceController : ControllerBase
{
    private readonly ILogger<RollDiceController> _logger;

    public RollDiceController(ILogger<RollDiceController> logger)
    {
        _logger = logger;
    }

    [HttpPost(Name = "RollDice")]
    public DiceRolls RollDice([FromBody] DiceInput input)
    {
        //Protect from errors with the math
        foreach (var dice in input.dice)
        {
            if (dice.favored > dice.faces)
            {
                throw new Exception("Favored Face is Greater than Number of Dice Faces");
            }

            if (dice.favored <= 0 || dice.faces <= 0 || dice.favoredFactor <= 0)
            {
                throw new Exception("Invalid Value in Input");
            }
        }

        //Start a new timer for the runtime results
        var watch = Stopwatch.StartNew();

        //Set the random generator
        MersenneTwister rng = new MersenneTwister();

        //Dictionary will hold the counts of the values rolled
        //ConcurrentDictionary<int, int> rollCounter = new ConcurrentDictionary<int, int>();
        Dictionary<int, int> rollCounter = new Dictionary<int, int>();
        for (int i = input.dice.Length; i <= input.dice.Sum(x => x.faces); i++)
        {
            rollCounter[i] = 0;
        }

        for (int i = 0; i < input.numberOfRolls; i++)
        {
            var newRoll = 0;
            for (int j = 0; j < input.dice.Length; j++)
            {
                int randomRange = input.dice[j].faces + input.dice[j].favoredFactor - 1; //favored factor x 1 shouldn't multiply by anything
                var roll = rng.Next(randomRange);
                //Values after the max number of faces is the favored faces
                int result = roll >= input.dice[j].faces ? (input.dice[j].favored - 1) : (int)roll; //Dice favored -1 because "1" actually should be face 0
                newRoll += result + 1; //updating, +1 because face[0] = 1
            }
            rollCounter[newRoll] = rollCounter[newRoll] + 1; //increment counter by 1
        }

        watch.Stop();

        //Convert from count to perfentage of rolls
        var percentageDictionary = new Dictionary<int, double>();
        rollCounter.ToList().ForEach(kvp => percentageDictionary.Add(kvp.Key, ((double)kvp.Value) / input.numberOfRolls));
        return new DiceRolls()
        {
            rolls = percentageDictionary,
            elapsedMilliseconds = watch.ElapsedMilliseconds
        };
    }
}